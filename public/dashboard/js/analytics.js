import Main from '../../frontend/main.js';

class Analytics {
  orders = [];
  tabsContainer;

  constructor() {
    this.tabsContainer = document.querySelector('.tabs-container');
    this.setupEventListeners();
    this.loadCharts();
  }

  setupEventListeners() {
    this.tabsContainer.addEventListener('click', this.toggleActiveTab.bind(this));
  }

  toggleActiveTab(event) {
    const charts = [...document.querySelectorAll('.chart')];
    const tabs = [...document.querySelectorAll('.tab')];

    if (event.target.classList.contains('active')) return;

    const chartType = event.target.getAttribute('data-chart');
    charts.forEach(chart => chart.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active'));

    document.querySelector(`#${chartType}-chart`).classList.remove('hidden');
    event.target.closest('.tab').classList.add('active');
  }

  async loadCharts() {
    try {
      const response = await fetch('/api/orders/asc');
      if (!response.ok) throw new Error('Failed to fetch orders');

      const { data: orders } = await response.json();
      this.renderCharts(orders);
    } catch (error) {
      console.error('Error loading orders for charts:', error);
    }
  }

  renderCharts(orders) {
    this.renderOrdersChart(orders);
    this.renderRevenueChart(orders);
  }

  renderOrdersChart(orders)
