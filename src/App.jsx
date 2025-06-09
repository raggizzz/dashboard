import React, { useState, useEffect } from 'react';
import './App.css';
import BrazilMap from './BrazilMap';
import JobAnalytics from './components/JobAnalytics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dados estatísticos detalhados por setor
const sectorData = {
  'Comercial/Vendas': { 
    count: 132481, 
    avgSalary: 2156.42, 
    pcdPercentage: 3.8, 
    skills: [
      { name: 'Comunicação', percentage: 78 },
      { name: 'Trabalho em equipe', percentage: 74 },
      { name: 'CRM', percentage: 47 },
      { name: 'Prospecção de clientes', percentage: 35 }
    ]
  },
  'Administração': { 
    count: 151014, 
    avgSalary: 2387.91, 
    pcdPercentage: 4.2, 
    skills: [
      { name: 'Organização', percentage: 52 },
      { name: 'Planejamento estratégico', percentage: 40 },
      { name: 'Excel', percentage: 66 },
      { name: 'Controle financeiro', percentage: 38 }
    ]
  },
  'Saúde': { 
    count: 5532, 
    avgSalary: 3842.15, 
    pcdPercentage: 6.1, 
    skills: [
      { name: 'Atendimento ao paciente', percentage: 45 },
      { name: 'Conhecimentos médicos', percentage: 42 },
      { name: 'Primeiros socorros', percentage: 38 },
      { name: 'Sistemas hospitalares', percentage: 25 }
    ]
  },
  'Agricultura': { 
    count: 208, 
    avgSalary: 2654.33, 
    pcdPercentage: 2.9, 
    skills: [
      { name: 'Manejo de culturas', percentage: 35 },
      { name: 'Irrigação', percentage: 28 },
      { name: 'Controle de pragas', percentage: 32 },
      { name: 'Agricultura sustentável', percentage: 22 }
    ]
  },
  'Engenharia': { 
    count: 8658, 
    avgSalary: 3276.84, 
    pcdPercentage: 3.5, 
    skills: [
      { name: 'CAD (AutoCAD/SolidWorks)', percentage: 26 },
      { name: 'Resolução de problemas', percentage: 59 },
      { name: 'Excel', percentage: 66 },
      { name: 'Normas técnicas', percentage: 24 }
    ]
  },
  'Informática / TI / Engenharia da Computação': { 
    count: 15946, 
    avgSalary: 4125.67, 
    pcdPercentage: 5.2, 
    skills: [
      { name: 'Python', percentage: 44 },
      { name: 'Cloud (AWS, Azure)', percentage: 23 },
      { name: 'Power BI/SQL', percentage: 48 },
      { name: 'DevOps', percentage: 21 }
    ]
  },
  'Atendimento/Call Center': { 
    count: 14843, 
    avgSalary: 1654.28, 
    pcdPercentage: 7.3, 
    skills: [
      { name: 'Comunicação', percentage: 78 },
      { name: 'Comunicação telefônica', percentage: 45 },
      { name: 'Resolução de conflitos', percentage: 40 },
      { name: 'Sistemas CRM', percentage: 47 }
    ]
  },
  'Contabilidade': { 
    count: 9195, 
    avgSalary: 2876.53, 
    pcdPercentage: 4.6, 
    skills: [
      { name: 'Legislação fiscal', percentage: 42 },
      { name: 'Demonstrações contábeis', percentage: 38 },
      { name: 'Auditoria', percentage: 28 },
      { name: 'Excel', percentage: 66 }
    ]
  },
  'Educação/Idiomas': { 
    count: 2165, 
    avgSalary: 2543.19, 
    pcdPercentage: 5.8, 
    skills: [
      { name: 'Planejamento pedagógico', percentage: 35 },
      { name: 'Ensino híbrido', percentage: 22 },
      { name: 'Inglês', percentage: 27 },
      { name: 'Metodologias ativas', percentage: 25 }
    ]
  },
  'Restaurante': { 
    count: 7886, 
    avgSalary: 1876.45, 
    pcdPercentage: 3.1, 
    skills: [
      { name: 'Atendimento ao cliente', percentage: 45 },
      { name: 'Conhecimento gastronômico', percentage: 28 },
      { name: 'Trabalho em equipe', percentage: 74 },
      { name: 'Higiene alimentar', percentage: 32 }
    ]
  },
  'Marketing/Comunicação': { 
    count: 6876, 
    avgSalary: 3154.72, 
    pcdPercentage: 4.9, 
    skills: [
      { name: 'Marketing digital', percentage: 35 },
      { name: 'Redes sociais', percentage: 28 },
      { name: 'Google Analytics', percentage: 22 },
      { name: 'Comunicação', percentage: 78 }
    ]
  },
  'Relações Internacionais': { 
    count: 4, 
    avgSalary: 5234.50, 
    pcdPercentage: 2.5, 
    skills: [
      { name: 'Fluência em idiomas', percentage: 15 },
      { name: 'Negociação internacional', percentage: 12 },
      { name: 'Comércio exterior', percentage: 10 },
      { name: 'Diplomacia', percentage: 8 }
    ]
  },
  'Estatística/Matemática/Atuária': { 
    count: 92, 
    avgSalary: 4567.89, 
    pcdPercentage: 4.3, 
    skills: [
      { name: 'Análise estatística', percentage: 26 },
      { name: 'Modelagem matemática', percentage: 23 },
      { name: 'Python', percentage: 44 },
      { name: 'Power BI/SQL', percentage: 48 }
    ]
  },
  'Jurídica': { 
    count: 1986, 
    avgSalary: 4123.76, 
    pcdPercentage: 3.7, 
    skills: [
      { name: 'Legislação trabalhista', percentage: 42 },
      { name: 'Contratos', percentage: 38 },
      { name: 'Processos judiciais', percentage: 35 },
      { name: 'Compliance', percentage: 28 }
    ]
  },
  'Aviação/Aeronáutica': { 
    count: 34, 
    avgSalary: 6789.12, 
    pcdPercentage: 2.9, 
    skills: [
      { name: 'Regulamentações aeronáuticas', percentage: 18 },
      { name: 'Segurança de voo', percentage: 16 },
      { name: 'Manutenção aeronáutica', percentage: 14 },
      { name: 'Inglês', percentage: 27 }
    ]
  }
};

// Dados das principais cidades
const cityData = [
  { city: 'São Paulo', state: 'SP', count: 235058 },
  { city: 'Rio de Janeiro', state: 'RJ', count: 89247 },
  { city: 'Belo Horizonte', state: 'MG', count: 38105 },
  { city: 'Curitiba', state: 'PR', count: 39514 },
  { city: 'Goiânia', state: 'GO', count: 32858 },
  { city: 'Salvador', state: 'BA', count: 30131 },
  { city: 'Brasília', state: 'DF', count: 30562 },
  { city: 'Fortaleza', state: 'CE', count: 28943 },
  { city: 'Recife', state: 'PE', count: 25674 },
  { city: 'Porto Alegre', state: 'RS', count: 24389 }
];

function App() {
  const [jobData, setJobData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    sector: '',
    salaryRange: '',
    experienceLevel: '',
    workType: ''
  });
  const [activeView, setActiveView] = useState('overview'); // overview, sectors, skills, cities, analytics

  useEffect(() => {
    // Ensure the JSON file is in the `public` directory for this fetch to work
    fetch('/vagas_com_habilidades.json') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setJobData(data);
        // console.log("Dados de vagas carregados:", data);
      })
      .catch(error => {
        console.error("Erro ao carregar dados de vagas:", error);
        // Consider setting some error state here to inform the user
      });
  }, []);

  // Estatísticas estáticas baseadas nos dados fornecidos
  const dashboardStats = {
    totalVacancies: "448.022",
    averageSalary: "R$ 2.124,38",
    vacanciesByArea: Object.entries(sectorData).map(([sector, data]) => ({ area: sector, count: data.count })),
    vacanciesByCity: cityData,
    workTypeDistribution: {
      presencial: 67.3,
      remoto: 18.7,
      hibrido: 14.0
    }
  };

  // Funções auxiliares
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const exportData = (format) => {
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Setor,Vagas,Salário Médio\n" +
        Object.entries(sectorData).map(([sector, data]) => 
          `${sector},${data.count},${data.avgSalary}`
        ).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "dashboard_vagas.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Função para obter dados dos gráficos
  const getChartData = (type) => {
    switch (type) {
      case 'sectors':
        return {
          labels: Object.keys(sectorData).slice(0, 8),
          datasets: [{
            label: 'Vagas por Setor',
            data: Object.values(sectorData).slice(0, 8).map(sector => sector.count),
            backgroundColor: [
              '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd',
              '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'
            ],
            borderColor: [
              '#1e3a8a', '#1e40af', '#2563eb', '#3b82f6',
              '#047857', '#059669', '#10b981', '#34d399'
            ],
            borderWidth: 2
          }]
        };
      case 'workType':
        return {
          labels: ['Presencial', 'Remoto', 'Híbrido'],
          datasets: [{
            label: 'Distribuição por Tipo de Trabalho',
            data: [65, 25, 10],
            backgroundColor: ['#1e40af', '#10b981', '#f59e0b'],
            borderColor: ['#1e3a8a', '#047857', '#d97706'],
            borderWidth: 2
          }]
        };
      case 'salaries':
        return {
          labels: Object.keys(sectorData).slice(0, 6),
          datasets: [{
            label: 'Salário Médio (R$)',
            data: Object.values(sectorData).slice(0, 6).map(sector => sector.avgSalary),
            backgroundColor: 'rgba(30, 64, 175, 0.8)',
            borderColor: '#1e40af',
            borderWidth: 2
          }]
        };
      default:
        return Object.entries(sectorData).map(([sector, data]) => ({
          name: sector,
          value: data.count,
          salary: data.avgSalary
        }));
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estatísticas do Mercado de Trabalho'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribuição de Vagas'
      },
    },
  };

  const handleStateClick = (stateInfo) => {
    setSelectedState(stateInfo);
    setSelectedJob(null); // Clear selected job when a new state is clicked
    // console.log("Estado selecionado no App:", stateInfo);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="App">
      {/* Header com estatísticas principais */}
      <header className="App-header">
        <div className="header-content">
          <div className="header-title">
            <img src="/LOGOTIPO.jpg" alt="EscritaComCiencia" className="logo" />
            <h1>🇧🇷 Dashboard de Vagas no Brasil</h1>
          </div>
          <div className="main-stats">
            <div className="stat-card">
              <div className="stat-number">{dashboardStats.totalVacancies}</div>
              <div className="stat-label">Total de Vagas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dashboardStats.averageSalary}</div>
              <div className="stat-label">Salário Médio Nacional</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dashboardStats.workTypeDistribution.presencial}%</div>
              <div className="stat-label">Vagas Presenciais</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dashboardStats.workTypeDistribution.remoto}%</div>
              <div className="stat-label">Vagas Remotas</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação */}
      <nav className="dashboard-nav">
        <button 
          className={activeView === 'overview' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveView('overview')}
        >
          📊 Visão Geral
        </button>
        <button 
          className={activeView === 'sectors' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveView('sectors')}
        >
          🏢 Setores
        </button>
        <button 
          className={activeView === 'skills' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveView('skills')}
        >
          🎯 Habilidades
        </button>
        <button 
          className={activeView === 'cities' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveView('cities')}
        >
          🏙️ Cidades
        </button>

      </nav>

      {/* Filtros */}
      <section className="filters-section">
        <div className="filters-container">
          <select 
            value={filters.state} 
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Estados</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
          </select>

          <select 
            value={filters.sector} 
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Áreas</option>
            {Object.keys(sectorData).map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>

          <select 
            value={filters.salaryRange} 
            onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Faixas Salariais</option>
            <option value="1000-2000">R$ 1.000 - R$ 2.000</option>
            <option value="2000-3000">R$ 2.000 - R$ 3.000</option>
            <option value="3000-5000">R$ 3.000 - R$ 5.000</option>
            <option value="5000+">Acima de R$ 5.000</option>
          </select>

          <select 
            value={filters.workType} 
            onChange={(e) => handleFilterChange('workType', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Tipos</option>
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
          </select>

          <button onClick={() => exportData('csv')} className="export-btn">
            📥 Exportar CSV
          </button>
        </div>
      </section>

      <main className="dashboard-main">
        {/* Visão Geral */}
        {activeView === 'overview' && (
          <>
            <section className="map-section">
              <h2>🗺️ Mapa Interativo do Brasil</h2>
              <div className="map-container">
                <BrazilMap jobData={jobData} onStateClick={handleStateClick} />
                {selectedState && (
                  <div className="state-info active-panel">
                    <h3>📍 {selectedState.name} ({selectedState.id})</h3>
                    <p><strong>Total de vagas:</strong> {selectedState.jobs ? selectedState.jobs.toLocaleString('pt-BR') : '0'}</p>
                    <div className="state-details">
                      <h4>🏙️ Principais Cidades:</h4>
                      <ul className="cities-list">
                        {cityData
                          .filter(city => city.state === selectedState.id)
                          .map((city, index) => (
                            <li key={index} className="city-item">
                              <span className="city-name">{city.city}</span>
                              <span className="city-count">{city.count.toLocaleString('pt-BR')} vagas</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="charts-section">
              <h2>📈 Gráficos Interativos</h2>
              <div className="charts-container">
                <div className="chart-card">
                  <h3>Vagas por Setor</h3>
                  <Bar data={getChartData('sectors')} options={chartOptions} />
                </div>
                <div className="chart-card">
                  <h3>Distribuição por Tipo de Trabalho</h3>
                  <Pie data={getChartData('workType')} options={pieOptions} />
                </div>
                <div className="chart-card">
                  <h3>Salário Médio por Setor</h3>
                  <Bar data={getChartData('salaries')} options={chartOptions} />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Setores */}
        {activeView === 'sectors' && (
          <section className="sectors-section">
            <h2>🏢 Análise por Setores</h2>
            <div className="sectors-grid">
              {Object.entries(sectorData).map(([sector, data]) => (
                <div 
                  key={sector} 
                  className={`sector-card ${selectedSector === sector ? 'selected' : ''}`}
                  onClick={() => setSelectedSector(selectedSector === sector ? null : sector)}
                >
                  <h3>{sector}</h3>
                  <div className="sector-stats">
                    <div className="stat">
                      <span className="stat-value">{data.count.toLocaleString('pt-BR')}</span>
                      <span className="stat-label">vagas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">R$ {data.avgSalary.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <span className="stat-label">salário médio</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">R$ {(data.avgSalary * 0.8).toLocaleString('pt-BR', {minimumFractionDigits: 2})} - R$ {(data.avgSalary * 1.2).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <span className="stat-label">faixa salarial</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Math.floor(data.count * (data.pcdPercentage / 100))} ({data.pcdPercentage.toFixed(1)}%)</span>
                      <span className="stat-label">vagas PCD</span>
                    </div>
                  </div>
                  <div className="sector-bar">
                    <div 
                      className="sector-progress" 
                      style={{width: `${(data.count / Math.max(...Object.values(sectorData).map(s => s.count))) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pcd-section">
              <h2>Inclusão PCD por Setor</h2>
              <div className="pcd-stats">
                <div className="pcd-summary">
                  <h3>Resumo Geral</h3>
                  <p><strong>Total de Vagas PCD:</strong> {Object.values(sectorData).reduce((sum, sector) => sum + Math.floor(sector.count * (sector.pcdPercentage / 100)), 0).toLocaleString('pt-BR')}</p>
                  <p><strong>Percentual Geral:</strong> {(4.37).toFixed(2)}%</p>
                </div>
                <div className="pcd-by-sector">
                  <h3>Ranking por Setor</h3>
                  <div className="pcd-ranking">
                    {Object.entries(sectorData)
                      .sort((a, b) => Math.floor(b[1].count * (b[1].pcdPercentage / 100)) - Math.floor(a[1].count * (a[1].pcdPercentage / 100)))
                      .slice(0, 8)
                      .map(([sector, data], index) => (
                        <div key={sector} className="pcd-rank-item">
                          <span className="rank">#{index + 1}</span>
                          <span className="sector-name">{sector}</span>
                          <span className="pcd-count">{Math.floor(data.count * (data.pcdPercentage / 100))} vagas</span>
                          <span className="pcd-percentage">{data.pcdPercentage.toFixed(1)}%</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Habilidades */}
        {activeView === 'skills' && (
          <section className="skills-section">
            <h2>🎯 Habilidades Mais Requisitadas por Setor</h2>
            <div className="skills-grid">
              {Object.entries(sectorData).map(([sector, data]) => (
                <div key={sector} className="skills-card">
                  <h3>{sector}</h3>
                  <div className="skills-list">
                    {data.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.name}
                          <span className="skill-percentage">{skill.percentage}%</span>
                        </span>
                      ))}
                  </div>
                  <div className="sector-info">
                    <span className="job-count">{data.count.toLocaleString('pt-BR')} vagas</span>
                    <span className="avg-salary">Média: R$ {data.avgSalary.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cidades */}
        {activeView === 'cities' && (
          <section className="cities-section">
            <h2>🏙️ Ranking das Principais Cidades</h2>
            <div className="cities-ranking">
              {cityData.map((city, index) => (
                <div key={index} className="city-rank-item">
                  <div className="rank-number">#{index + 1}</div>
                  <div className="city-info">
                    <h3>{city.city}, {city.state}</h3>
                    <div className="city-stats">
                      <span className="job-count">{city.count.toLocaleString('pt-BR')} vagas</span>
                      <span className="percentage">{((city.count / 448022) * 100).toFixed(1)}% do total</span>
                    </div>
                  </div>
                  <div className="city-bar">
                    <div 
                      className="city-progress" 
                      style={{width: `${(city.count / cityData[0].count) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


      </main>

      <footer className="App-footer">
        <p>&copy; 2025 EscritaComCiencia - Dashboard de Vagas Brasil. Desenvolvido com dados realistas para análise do mercado de trabalho.</p>
      </footer>
    </div>
  );
}

export default App;