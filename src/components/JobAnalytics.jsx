import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import './JobAnalytics.css';

const JobAnalytics = ({ jobData }) => {
  const [activeTab, setActiveTab] = useState('salary');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Função para extrair valor numérico do salário
  const extractSalaryValue = (salaryString) => {
    if (!salaryString || salaryString === 'A combinar' || salaryString === 'Não informado') {
      return null;
    }
    
    // Remove R$, espaços e vírgulas, mantém apenas números e pontos
    const cleanSalary = salaryString.replace(/[R$\s,]/g, '').replace(/\./g, '');
    
    // Se contém hífen (faixa salarial), pega a média
    if (cleanSalary.includes('-')) {
      const [min, max] = cleanSalary.split('-').map(val => parseFloat(val));
      return (min + max) / 2;
    }
    
    const value = parseFloat(cleanSalary);
    return isNaN(value) ? null : value;
  };

  // Análise de salários
  const salaryAnalysis = useMemo(() => {
    const validSalaries = jobData
      .map(job => extractSalaryValue(job.Salário))
      .filter(salary => salary !== null && salary > 0);

    if (validSalaries.length === 0) {
      return {
        highest: 0,
        lowest: 0,
        average: 0,
        median: 0,
        total: 0,
        withSalary: 0,
        withoutSalary: jobData.length
      };
    }

    validSalaries.sort((a, b) => a - b);
    const median = validSalaries.length % 2 === 0
      ? (validSalaries[validSalaries.length / 2 - 1] + validSalaries[validSalaries.length / 2]) / 2
      : validSalaries[Math.floor(validSalaries.length / 2)];

    return {
      highest: Math.max(...validSalaries),
      lowest: Math.min(...validSalaries),
      average: validSalaries.reduce((sum, salary) => sum + salary, 0) / validSalaries.length,
      median,
      total: jobData.length,
      withSalary: validSalaries.length,
      withoutSalary: jobData.length - validSalaries.length
    };
  }, [jobData]);

  // Análise de habilidades
  const skillsAnalysis = useMemo(() => {
    const skillCount = {};
    const skillByArea = {};
    
    jobData.forEach(job => {
      if (job.Habilidades && Array.isArray(job.Habilidades)) {
        job.Habilidades.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
          
          if (!skillByArea[skill]) {
            skillByArea[skill] = {};
          }
          const area = job.Cargo || 'Não especificado';
          skillByArea[skill][area] = (skillByArea[skill][area] || 0) + 1;
        });
      }
    });

    const totalSkills = Object.values(skillCount).reduce((sum, count) => sum + count, 0);
    const skillsWithPercentage = Object.entries(skillCount)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: ((count / totalSkills) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      top5: skillsWithPercentage.slice(0, 5),
      all: skillsWithPercentage,
      byArea: skillByArea,
      total: totalSkills
    };
  }, [jobData]);

  // Análise de inclusão PCD
  const pcdAnalysis = useMemo(() => {
    const pcdKeywords = ['inclusão', 'pcd', 'deficiência', 'acessibilidade', 'inclusivo', 'diversidade'];
    
    const pcdJobs = jobData.filter(job => {
      const searchText = `${job.Título} ${job.Cargo} ${job.Habilidades?.join(' ') || ''}`.toLowerCase();
      return pcdKeywords.some(keyword => searchText.includes(keyword));
    });

    const pcdByArea = {};
    pcdJobs.forEach(job => {
      const area = job.Cargo || 'Não especificado';
      pcdByArea[area] = (pcdByArea[area] || 0) + 1;
    });

    return {
      total: pcdJobs.length,
      percentage: ((pcdJobs.length / jobData.length) * 100).toFixed(2),
      byArea: Object.entries(pcdByArea)
        .map(([area, count]) => ({ area, count }))
        .sort((a, b) => b.count - a.count),
      jobs: pcdJobs
    };
  }, [jobData]);

  // Análise de áreas por habilidade
  const getAreasBySkill = (skill) => {
    if (!skill || !skillsAnalysis.byArea[skill]) return [];
    
    return Object.entries(skillsAnalysis.byArea[skill])
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Filtrar vagas por critérios
  const filterJobs = (criteria) => {
    return jobData.filter(job => {
      if (criteria.skill && (!job.Habilidades || !job.Habilidades.includes(criteria.skill))) {
        return false;
      }
      if (criteria.area && job.Cargo !== criteria.area) {
        return false;
      }
      if (criteria.pcd) {
        const searchText = `${job.Título} ${job.Cargo} ${job.Habilidades?.join(' ') || ''}`.toLowerCase();
        const pcdKeywords = ['inclusão', 'pcd', 'deficiência', 'acessibilidade', 'inclusivo', 'diversidade'];
        return pcdKeywords.some(keyword => searchText.includes(keyword));
      }
      return true;
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderSalaryAnalysis = () => (
    <div className="analysis-section">
      <h3>Análise Salarial</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Maior Salário</h4>
          <p className="stat-value">{formatCurrency(salaryAnalysis.highest)}</p>
        </div>
        <div className="stat-card">
          <h4>Menor Salário</h4>
          <p className="stat-value">{formatCurrency(salaryAnalysis.lowest)}</p>
        </div>
        <div className="stat-card">
          <h4>Salário Médio</h4>
          <p className="stat-value">{formatCurrency(salaryAnalysis.average)}</p>
        </div>
        <div className="stat-card">
          <h4>Mediana</h4>
          <p className="stat-value">{formatCurrency(salaryAnalysis.median)}</p>
        </div>
      </div>
      
      <div className="salary-distribution">
        <h4>Distribuição de Informações Salariais</h4>
        <div className="chart-container">
          <Pie
            data={{
              labels: ['Com Salário Informado', 'Sem Salário Informado'],
              datasets: [{
                data: [salaryAnalysis.withSalary, salaryAnalysis.withoutSalary],
                backgroundColor: ['#4CAF50', '#FF9800'],
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderSkillsAnalysis = () => (
    <div className="analysis-section">
      <h3>Top 5 Habilidades Mais Requisitadas</h3>
      <div className="skills-list">
        {skillsAnalysis.top5.map((skill, index) => (
          <div key={skill.skill} className="skill-item">
            <span className="skill-rank">#{index + 1}</span>
            <span className="skill-name">{skill.skill}</span>
            <span className="skill-count">{skill.count} vagas</span>
            <span className="skill-percentage">{skill.percentage}%</span>
          </div>
        ))}
      </div>
      
      <div className="chart-container">
        <Bar
          data={{
            labels: skillsAnalysis.top5.map(s => s.skill),
            datasets: [{
              label: 'Número de Vagas',
              data: skillsAnalysis.top5.map(s => s.count),
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
              borderWidth: 1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  );

  const renderPcdAnalysis = () => (
    <div className="analysis-section">
      <h3>Inclusão PCD</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Vagas Inclusivas</h4>
          <p className="stat-value">{pcdAnalysis.total}</p>
          <p className="stat-subtitle">{pcdAnalysis.percentage}% do total</p>
        </div>
        <div className="stat-card">
          <h4>Total de Vagas</h4>
          <p className="stat-value">{jobData.length}</p>
        </div>
      </div>
      
      {pcdAnalysis.byArea.length > 0 && (
        <div className="pcd-areas">
          <h4>Áreas com Mais Vagas Inclusivas</h4>
          <div className="areas-list">
            {pcdAnalysis.byArea.slice(0, 10).map((area, index) => (
              <div key={area.area} className="area-item">
                <span className="area-name">{area.area}</span>
                <span className="area-count">{area.count} vagas</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSkillAreas = () => (
    <div className="analysis-section">
      <h3>Habilidades → Áreas Mais Requeridas</h3>
      <div className="skill-selector">
        <select 
          value={selectedSkill} 
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="skill-select"
        >
          <option value="">Selecione uma habilidade</option>
          {skillsAnalysis.all.slice(0, 20).map(skill => (
            <option key={skill.skill} value={skill.skill}>
              {skill.skill} ({skill.count} vagas)
            </option>
          ))}
        </select>
      </div>
      
      {selectedSkill && (
        <div className="skill-areas">
          <h4>Áreas que mais requerem: {selectedSkill}</h4>
          <div className="areas-list">
            {getAreasBySkill(selectedSkill).slice(0, 10).map((area, index) => (
              <div key={area.area} className="area-item">
                <span className="area-rank">#{index + 1}</span>
                <span className="area-name">{area.area}</span>
                <span className="area-count">{area.count} vagas</span>
                <button 
                  className="view-jobs-btn"
                  onClick={() => {
                    const jobs = filterJobs({ skill: selectedSkill, area: area.area });
                    setFilteredJobs(jobs);
                  }}
                >
                  Ver Vagas
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderJobsList = () => (
    <div className="jobs-list">
      <h4>Vagas Encontradas ({filteredJobs.length})</h4>
      <div className="jobs-container">
        {filteredJobs.slice(0, 20).map((job, index) => (
          <div key={index} className="job-card">
            <h5>{job.Título}</h5>
            <p><strong>Empresa:</strong> {job.Empresa}</p>
            <p><strong>Cargo:</strong> {job.Cargo}</p>
            <p><strong>Localização:</strong> {job.Localização}</p>
            <p><strong>Salário:</strong> {job.Salário}</p>
            {job.Habilidades && (
              <div className="job-skills">
                <strong>Habilidades:</strong>
                <div className="skills-tags">
                  {job.Habilidades.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {job.Link && (
              <a href={job.Link} target="_blank" rel="noopener noreferrer" className="job-link">
                Ver Vaga
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="job-analytics">
      <div className="analytics-header">
        <h2>Análise do Mercado de Trabalho</h2>
        <p>Dados baseados em {jobData.length} vagas coletadas</p>
      </div>
      
      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'salary' ? 'active' : ''}`}
          onClick={() => setActiveTab('salary')}
        >
          Análise Salarial
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Top 5 Habilidades
        </button>
        <button 
          className={`tab ${activeTab === 'pcd' ? 'active' : ''}`}
          onClick={() => setActiveTab('pcd')}
        >
          Inclusão PCD
        </button>
        <button 
          className={`tab ${activeTab === 'skill-areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('skill-areas')}
        >
          Habilidades → Áreas
        </button>
      </div>
      
      <div className="analytics-content">
        {activeTab === 'salary' && renderSalaryAnalysis()}
        {activeTab === 'skills' && renderSkillsAnalysis()}
        {activeTab === 'pcd' && renderPcdAnalysis()}
        {activeTab === 'skill-areas' && renderSkillAreas()}
      </div>
      
      {filteredJobs.length > 0 && renderJobsList()}
    </div>
  );
};

export default JobAnalytics;