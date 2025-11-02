// --- Helpers ---
const $ = id => document.getElementById(id);
let procs = [];
let animation = null;
let currentTime = 0;
let rrQueue = [];
let running = false;
let quantum = 2;
let ctx = $('canvas').getContext('2d');

// --- Process class ---
class Proc {
  constructor(id, arrival, burst) {
    this.id = id;
    this.arrival = Number(arrival);
    this.burst = Number(burst);
    this.remaining = Number(burst);
    this.completion = null;
    this.turnaround = null;
    this.waiting = null;
  }
}

// --- Refresh table UI ---
function refreshTable() {
  const tbody = $('ptable').querySelector('tbody');
  tbody.innerHTML = '';
  procs.forEach((p, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.arrival}</td>
      <td>${p.burst}</td>
      <td>${p.remaining}</td>
      <td>${p.completion ?? '—'}</td>
      <td>${p.turnaround ?? '—'}</td>
      <td>${p.waiting ?? '—'}</td>
      <td><button data-index="${i}" class="btn-danger">✖</button></td>`;
    tbody.appendChild(row);
  });

  // Delete handler
  tbody.querySelectorAll('.btn-danger').forEach(btn => {
    btn.onclick = e => {
      const idx = parseInt(e.target.dataset.index);
      procs.splice(idx, 1);
      refreshTable();
    };
  });
}

// --- Button handlers ---
$('add').onclick = () => {
  const id = 'P' + (procs.length + 1);
  const arrival = prompt('Enter arrival time for ' + id, '0');
  if (arrival === null) return;
  const burst = prompt('Enter burst time for ' + id, '4');
  if (burst === null) return;
  const p = new Proc(id, arrival, burst);
  procs.push(p);
  refreshTable();
};

$('clear').onclick = () => { procs = []; refreshTable(); resetCanvas(); };

$('start').onclick = () => {
  if (procs.length === 0) {
    alert('Add at least one process first.');
    return;
  }
  if (running) return;
  quantum = Number($('quantum').value) || 2;
  startSimulation();
};

$('pause').onclick = () => stopSimulation();

// --- Simulation ---
function startSimulation() {
  running = true;
  currentTime = 0;
  rrQueue = [];
  procs.forEach(p => {
    p.remaining = p.burst;
    p.completion = p.turnaround = p.waiting = null;
  });

  animation = setInterval(simulateStep, 600);
}

function stopSimulation() {
  running = false;
  clearInterval(animation);
}

function simulateStep() {
  // Add arrived processes to queue
  procs.forEach(p => {
    if (p.arrival <= currentTime && !rrQueue.includes(p) && p.remaining > 0 && !p.visited) {
      rrQueue.push(p);
      p.visited = true;
    }
  });

  // If no process ready
  if (rrQueue.length === 0) {
    currentTime++;
    drawCanvas();
    return;
  }

  const p = rrQueue.shift();
  const exec = Math.min(p.remaining, quantum);
  p.remaining -= exec;
  currentTime += exec;

  // Update queue with new arrivals during execution
  procs.forEach(proc => {
    if (proc.arrival <= currentTime && proc.remaining > 0 && !rrQueue.includes(proc) && !proc.visited) {
      rrQueue.push(proc);
      proc.visited = true;
    }
  });

  if (p.remaining > 0) {
    rrQueue.push(p);
  } else {
    p.completion = currentTime;
    p.turnaround = p.completion - p.arrival;
    p.waiting = p.turnaround - p.burst;
  }

  drawCanvas();
  updateMetrics();
  refreshTable();

  // Check if all done
  if (procs.every(x => x.remaining === 0)) {
    stopSimulation();
  }
}

// --- Dashboard Metrics ---
function updateMetrics() {
  const completed = procs.filter(p => p.completion != null);
  if (completed.length === 0) return;

  const totalTime = Math.max(...completed.map(p => p.completion));
  const cpuBusy = completed.reduce((a, b) => a + b.burst, 0);
  const util = (cpuBusy / totalTime) * 100;

  const avgWait = completed.reduce((a,b)=>a+b.waiting,0)/completed.length;
  const avgTurn = completed.reduce((a,b)=>a+b.turnaround,0)/completed.length;
  const throughput = completed.length / totalTime;

  $('cpuUtil').innerText = util.toFixed(1) + '%';
  $('avgWait').innerText = avgWait.toFixed(1);
  $('avgTurn').innerText = avgTurn.toFixed(1);
  $('throughput').innerText = throughput.toFixed(2);
}

// --- Canvas Animation ---
function resetCanvas() {
  ctx.clearRect(0,0,$('canvas').width,$('canvas').height);
}

function drawCanvas() {
  const canvas = $('canvas');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  const barHeight = 30;
  const gap = 15;
  const colors = ['#4cc9f0','#f72585','#b5179e','#7209b7','#4361ee'];

  procs.forEach((p, i) => {
    const x = 50;
    const y = 30 + i * (barHeight + gap);
    const width = ((p.burst - p.remaining) / p.burst) * (w - 100);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, width, barHeight);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, w - 100, barHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(p.id, 10, y + 20);
  });
}

// Initialize
refreshTable();
