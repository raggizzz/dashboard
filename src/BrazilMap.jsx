import React, { useState, useEffect, useRef } from 'react';

const BrazilMap = ({ jobData, onStateClick }) => {
  const [stateJobCounts, setStateJobCounts] = useState({});
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [selectedState, setSelectedState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  // Mapeamento de códigos de estado para nomes completos
  const stateNames = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
    'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
  };

  // Mapeamento melhorado de cidades para estados
  const cityToState = {
    // São Paulo
    'SÃO PAULO': 'SP', 'SANTOS': 'SP', 'CAMPINAS': 'SP', 'RIBEIRÃO PRETO': 'SP',
    'SOROCABA': 'SP', 'SÃO JOSÉ DOS CAMPOS': 'SP', 'OSASCO': 'SP', 'BAURU': 'SP',
    // Rio de Janeiro
    'RIO DE JANEIRO': 'RJ', 'NITERÓI': 'RJ', 'NOVA IGUAÇU': 'RJ', 'DUQUE DE CAXIAS': 'RJ',
    'CAMPOS DOS GOYTACAZES': 'RJ', 'PETRÓPOLIS': 'RJ', 'VOLTA REDONDA': 'RJ',
    // Minas Gerais
    'BELO HORIZONTE': 'MG', 'UBERLÂNDIA': 'MG', 'CONTAGEM': 'MG', 'JUIZ DE FORA': 'MG',
    'BETIM': 'MG', 'MONTES CLAROS': 'MG', 'RIBEIRÃO DAS NEVES': 'MG',
    // Bahia
    'SALVADOR': 'BA', 'FEIRA DE SANTANA': 'BA', 'VITÓRIA DA CONQUISTA': 'BA',
    'CAMAÇARI': 'BA', 'ITABUNA': 'BA', 'JUAZEIRO': 'BA',
    // Paraná
    'CURITIBA': 'PR', 'LONDRINA': 'PR', 'MARINGÁ': 'PR', 'PONTA GROSSA': 'PR',
    'CASCAVEL': 'PR', 'SÃO JOSÉ DOS PINHAIS': 'PR', 'FOZ DO IGUAÇU': 'PR',
    // Rio Grande do Sul
    'PORTO ALEGRE': 'RS', 'CAXIAS DO SUL': 'RS', 'PELOTAS': 'RS', 'CANOAS': 'RS',
    'SANTA MARIA': 'RS', 'GRAVATAÍ': 'RS', 'VIAMÃO': 'RS',
    // Pernambuco
    'RECIFE': 'PE', 'JABOATÃO DOS GUARARAPES': 'PE', 'OLINDA': 'PE', 'CARUARU': 'PE',
    'PETROLINA': 'PE', 'PAULISTA': 'PE',
    // Ceará
    'FORTALEZA': 'CE', 'CAUCAIA': 'CE', 'JUAZEIRO DO NORTE': 'CE', 'MARACANAÚ': 'CE',
    'SOBRAL': 'CE', 'CRATO': 'CE',
    // Pará
    'BELÉM': 'PA', 'ANANINDEUA': 'PA', 'SANTARÉM': 'PA', 'MARABÁ': 'PA',
    'PARAUAPEBAS': 'PA', 'CASTANHAL': 'PA',
    // Santa Catarina
    'FLORIANÓPOLIS': 'SC', 'JOINVILLE': 'SC', 'BLUMENAU': 'SC', 'SÃO JOSÉ': 'SC',
    'CRICIÚMA': 'SC', 'CHAPECÓ': 'SC',
    // Goiás
    'GOIÂNIA': 'GO', 'APARECIDA DE GOIÂNIA': 'GO', 'ANÁPOLIS': 'GO', 'RIO VERDE': 'GO',
    'LUZIÂNIA': 'GO', 'ÁGUAS LINDAS DE GOIÁS': 'GO',
    // Maranhão
    'SÃO LUÍS': 'MA', 'IMPERATRIZ': 'MA', 'SÃO JOSÉ DE RIBAMAR': 'MA', 'TIMON': 'MA',
    'CAXIAS': 'MA', 'CODÓ': 'MA',
    // Paraíba
    'JOÃO PESSOA': 'PB', 'CAMPINA GRANDE': 'PB', 'SANTA RITA': 'PB', 'PATOS': 'PB',
    'BAYEUX': 'PB', 'SOUSA': 'PB',
    // Espírito Santo
    'VITÓRIA': 'ES', 'VILA VELHA': 'ES', 'SERRA': 'ES', 'CARIACICA': 'ES',
    'CACHOEIRO DE ITAPEMIRIM': 'ES', 'LINHARES': 'ES',
    // Alagoas
    'MACEIÓ': 'AL', 'ARAPIRACA': 'AL', 'RIO LARGO': 'AL', 'PALMEIRA DOS ÍNDIOS': 'AL',
    'UNIÃO DOS PALMARES': 'AL', 'PENEDO': 'AL',
    // Mato Grosso
    'CUIABÁ': 'MT', 'VÁRZEA GRANDE': 'MT', 'RONDONÓPOLIS': 'MT', 'SINOP': 'MT',
    'TANGARÁ DA SERRA': 'MT', 'CÁCERES': 'MT',
    // Distrito Federal
    'BRASÍLIA': 'DF', 'TAGUATINGA': 'DF', 'CEILÂNDIA': 'DF', 'GAMA': 'DF',
    'PLANALTINA': 'DF', 'SOBRADINHO': 'DF',
    // Mato Grosso do Sul
    'CAMPO GRANDE': 'MS', 'DOURADOS': 'MS', 'TRÊS LAGOAS': 'MS', 'CORUMBÁ': 'MS',
    'PONTA PORÃ': 'MS', 'NAVIRAÍ': 'MS',
    // Sergipe
    'ARACAJU': 'SE', 'NOSSA SENHORA DO SOCORRO': 'SE', 'LAGARTO': 'SE', 'ITABAIANA': 'SE',
    'SÃO CRISTÓVÃO': 'SE', 'ESTÂNCIA': 'SE',
    // Rio Grande do Norte
    'NATAL': 'RN', 'MOSSORÓ': 'RN', 'PARNAMIRIM': 'RN', 'SÃO GONÇALO DO AMARANTE': 'RN',
    'MACAÍBA': 'RN', 'CEARÁ-MIRIM': 'RN',
    // Piauí
    'TERESINA': 'PI', 'PARNAÍBA': 'PI', 'PICOS': 'PI', 'PIRIPIRI': 'PI',
    'FLORIANO': 'PI', 'CAMPO MAIOR': 'PI',
    // Acre
    'RIO BRANCO': 'AC', 'CRUZEIRO DO SUL': 'AC', 'SENA MADUREIRA': 'AC', 'TARAUACÁ': 'AC',
    // Amapá
    'MACAPÁ': 'AP', 'SANTANA': 'AP', 'LARANJAL DO JARI': 'AP', 'OIAPOQUE': 'AP',
    // Amazonas
    'MANAUS': 'AM', 'PARINTINS': 'AM', 'ITACOATIARA': 'AM', 'MANACAPURU': 'AM',
    // Rondônia
    'PORTO VELHO': 'RO', 'JI-PARANÁ': 'RO', 'ARIQUEMES': 'RO', 'VILHENA': 'RO',
    // Roraima
    'BOA VISTA': 'RR', 'RORAINÓPOLIS': 'RR', 'CARACARAÍ': 'RR',
    // Tocantins
    'PALMAS': 'TO', 'ARAGUAÍNA': 'TO', 'GURUPI': 'TO', 'PORTO NACIONAL': 'TO'
  };

  // Função melhorada para extrair estado da localização
  const extractStateFromLocation = (location) => {
    if (!location || location === "Localização não disponível" || !location.trim()) {
      return null;
    }

    const loc = location.toUpperCase().trim();
    
    // Verificar se já é um código de estado
    if (loc.length === 2 && /^[A-Z]{2}$/.test(loc) && stateNames[loc]) {
      return loc;
    }

    // Verificar se termina com código de estado (formato: "Cidade, Estado, UF")
    const parts = loc.split(',');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim();
      if (lastPart.length === 2 && /^[A-Z]{2}$/.test(lastPart) && stateNames[lastPart]) {
        return lastPart;
      }
    }

    // Verificar mapeamento de cidades
    for (const [city, state] of Object.entries(cityToState)) {
      if (loc.includes(city)) {
        return state;
      }
    }

    // Verificar nomes completos de estados
    for (const [code, name] of Object.entries(stateNames)) {
      if (loc.includes(name.toUpperCase())) {
        return code;
      }
    }

    // Verificar códigos de estado em qualquer parte da string
    for (const code of Object.keys(stateNames)) {
      if (loc.includes(code)) {
        return code;
      }
    }

    return null;
  };

  // Processar dados das vagas
  useEffect(() => {
    if (jobData && jobData.length > 0) {
      console.log('🔄 Processando', jobData.length, 'vagas...');
      const counts = {};
      let processedCount = 0;
      let mappedCount = 0;
      
      jobData.forEach(job => {
        processedCount++;
        const stateCode = extractStateFromLocation(job.Localização);
        
        if (stateCode) {
          counts[stateCode] = (counts[stateCode] || 0) + 1;
          mappedCount++;
        }
      });
      
      console.log('📊 Resultado do processamento:', {
        totalVagas: processedCount,
        vagasMapeadas: mappedCount,
        percentualMapeado: ((mappedCount / processedCount) * 100).toFixed(1) + '%',
        estadosEncontrados: Object.keys(counts).length,
        distribuicao: counts
      });
      
      setStateJobCounts(counts);
      setIsLoading(false);
    }
  }, [jobData]);

  useEffect(() => {
    if (jobData && jobData.length > 0) {
      console.log('Processando dados de trabalho:', jobData.length, 'vagas');
      const counts = {};
      let processedCount = 0;
      let validLocationCount = 0;
      
      jobData.forEach(job => {
        const loc = job.Localização || "";
        processedCount++;
        
        // Pular localizações inválidas
        if (loc === "Localização não disponível" || !loc.trim()) {
          return;
        }
        
        validLocationCount++;
        const parts = loc.split(',');
        let stateCode = "";
        
        if (parts.length > 1) {
          stateCode = parts[parts.length - 1].trim().toUpperCase();
          if (stateCode.length === 2 && /^[A-Z]+$/.test(stateCode)) {
            counts[stateCode] = (counts[stateCode] || 0) + 1;
          }
        } else if (loc.length === 2 && /^[A-Z]+$/.test(loc)) {
          counts[loc] = (counts[loc] || 0) + 1;
        }
        
        // Tentar extrair estado de outras formas
        const locationUpper = loc.toUpperCase();
        Object.keys(stateNames).forEach(code => {
          const stateName = stateNames[code].toUpperCase();
          if (locationUpper.includes(stateName) || locationUpper.includes(code)) {
            counts[code] = (counts[code] || 0) + 1;
          }
        });
      });
      
      console.log('Dados processados:', {
        total: processedCount,
        validLocations: validLocationCount,
        statesCounts: counts,
        totalMapped: Object.values(counts).reduce((a, b) => a + b, 0)
      });
      
      setStateJobCounts(counts);
    }
  }, [jobData]);

  // SVG do mapa do Brasil com design melhorado
  const brazilMapSVG = `
    <svg viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradientes para efeitos visuais -->
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
        
        <!-- Filtros para sombras e efeitos -->
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      <!-- Fundo do mapa com gradiente -->
      <rect width="1000" height="800" fill="url(#mapGradient)" rx="10" ry="10"/>
      
      <!-- Estados do Brasil com coordenadas mais realistas -->
      <!-- Acre -->
      <path id="AC" d="M120,420 L180,400 L200,440 L160,470 L120,450 Z" filter="url(#dropShadow)" />
      <!-- Alagoas -->
      <path id="AL" d="M680,460 L710,450 L720,480 L690,490 Z" filter="url(#dropShadow)" />
      <!-- Amapá -->
      <path id="AP" d="M420,120 L450,110 L460,140 L430,150 Z" filter="url(#dropShadow)" />
      <!-- Amazonas -->
      <path id="AM" d="M80,220 L320,200 L340,320 L300,370 L180,400 L60,270 Z" filter="url(#dropShadow)" />
      <!-- Bahia -->
      <path id="BA" d="M520,370 L680,360 L710,470 L650,520 L540,500 L480,420 Z" filter="url(#dropShadow)" />
      <!-- Ceará -->
      <path id="CE" d="M600,230 L670,220 L690,260 L640,280 L580,270 Z" filter="url(#dropShadow)" />
      <!-- Distrito Federal -->
      <path id="DF" d="M540,400 L550,395 L555,405 L545,410 Z" filter="url(#dropShadow)" />
      <!-- Espírito Santo -->
      <path id="ES" d="M670,470 L700,460 L710,490 L680,500 Z" filter="url(#dropShadow)" />
      <!-- Goiás -->
      <path id="GO" d="M460,370 L600,360 L620,440 L540,460 L440,420 Z" filter="url(#dropShadow)" />
      <!-- Maranhão -->
      <path id="MA" d="M470,230 L570,220 L590,280 L520,300 L440,280 Z" filter="url(#dropShadow)" />
      <!-- Mato Grosso -->
      <path id="MT" d="M330,370 L500,360 L520,440 L440,470 L300,450 Z" filter="url(#dropShadow)" />
      <!-- Mato Grosso do Sul -->
      <path id="MS" d="M420,470 L520,460 L540,540 L470,560 L400,540 Z" filter="url(#dropShadow)" />
      <!-- Minas Gerais -->
      <path id="MG" d="M540,420 L670,410 L700,500 L640,540 L540,560 L500,500 Z" filter="url(#dropShadow)" />
      <!-- Pará -->
      <path id="PA" d="M320,160 L520,140 L540,260 L470,300 L370,280 Z" filter="url(#dropShadow)" />
      <!-- Paraíba -->
      <path id="PB" d="M670,260 L700,250 L710,280 L680,290 Z" filter="url(#dropShadow)" />
      <!-- Paraná -->
      <path id="PR" d="M540,560 L640,550 L660,600 L600,620 L500,610 Z" filter="url(#dropShadow)" />
      <!-- Pernambuco -->
      <path id="PE" d="M620,280 L700,270 L720,320 L670,340 L600,330 Z" filter="url(#dropShadow)" />
      <!-- Piauí -->
      <path id="PI" d="M520,260 L600,250 L620,310 L560,330 L500,310 Z" filter="url(#dropShadow)" />
      <!-- Rio de Janeiro -->
      <path id="RJ" d="M700,500 L740,490 L750,520 L720,530 Z" filter="url(#dropShadow)" />
      <!-- Rio Grande do Norte -->
      <path id="RN" d="M700,230 L730,220 L740,250 L710,260 Z" filter="url(#dropShadow)" />
      <!-- Rio Grande do Sul -->
      <path id="RS" d="M540,620 L640,610 L660,670 L600,690 L500,680 Z" filter="url(#dropShadow)" />
      <!-- Rondônia -->
      <path id="RO" d="M270,400 L340,390 L360,440 L320,460 L250,450 Z" filter="url(#dropShadow)" />
      <!-- Roraima -->
      <path id="RR" d="M320,80 L400,70 L420,120 L370,140 L300,130 Z" filter="url(#dropShadow)" />
      <!-- Santa Catarina -->
      <path id="SC" d="M600,600 L670,590 L690,630 L640,650 L570,640 Z" filter="url(#dropShadow)" />
      <!-- São Paulo -->
      <path id="SP" d="M600,540 L700,530 L720,580 L670,600 L570,590 Z" filter="url(#dropShadow)" />
      <!-- Sergipe -->
      <path id="SE" d="M670,340 L700,330 L710,360 L680,370 Z" filter="url(#dropShadow)" />
      <!-- Tocantins -->
      <path id="TO" d="M500,260 L570,250 L590,320 L540,340 L480,330 Z" filter="url(#dropShadow)" />
    </svg>
  `;

  // Função para lidar com eventos do mouse
  const handleMouseMove = (e, stateCode, jobCount) => {
    const rect = mapRef.current.getBoundingClientRect();
    const stateName = stateNames[stateCode] || stateCode;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: `${stateName}: ${jobCount.toLocaleString('pt-BR')} vagas`
    });
  };

  // Função para lidar com cliques
  const handleClick = (stateCode) => {
    setSelectedState(stateCode);
    if (onStateClick) {
      const stateName = stateNames[stateCode] || stateCode;
      const jobCount = stateJobCounts[stateCode] || 0;
      const totalJobs = Object.values(stateJobCounts).reduce((a, b) => a + b, 0);
      onStateClick({ 
        id: stateCode, 
        name: stateName, 
        jobs: jobCount,
        percentage: totalJobs > 0 ? ((jobCount / totalJobs) * 100).toFixed(1) : '0'
      });
    }
  };

  // Renderizar o mapa com interatividade
  useEffect(() => {
    if (mapRef.current && !isLoading) {
      try {
        // Inserir o SVG no container
        mapRef.current.innerHTML = brazilMapSVG;
        
        // Obter todos os paths (estados)
        const paths = mapRef.current.querySelectorAll('path');
        console.log('🗺️ Estados encontrados no mapa:', paths.length);
        
        paths.forEach((path) => {
          const stateCode = path.getAttribute('id');
          
          if (stateCode && stateNames[stateCode]) {
            const jobCount = stateJobCounts[stateCode] || 0;
            const color = getColorForValue(jobCount);
            
            // Aplicar estilos modernos
             path.style.fill = color;
             path.style.stroke = '#ffffff';
             path.style.strokeWidth = '2';
             path.style.cursor = 'pointer';
             path.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
             path.style.transformOrigin = 'center';
             
             // Adicionar classe CSS para animações
             path.classList.add('map-state');
             
             // Event listeners com efeitos aprimorados
             path.addEventListener('mouseenter', (e) => {
               path.style.strokeWidth = '4';
               path.style.stroke = '#1e40af';
               path.style.filter = 'brightness(1.15) drop-shadow(0 8px 16px rgba(30, 64, 175, 0.3))';
               path.style.transform = 'scale(1.02)';
               path.style.zIndex = '10';
               handleMouseMove(e, stateCode, jobCount);
             });
             
             path.addEventListener('mouseleave', () => {
               path.style.strokeWidth = '2';
               path.style.stroke = '#ffffff';
               path.style.filter = 'none';
               path.style.transform = 'scale(1)';
               path.style.zIndex = '1';
               setTooltip({ visible: false, x: 0, y: 0, content: '' });
             });
             
             path.addEventListener('click', () => {
               // Efeito de clique
               path.style.transform = 'scale(0.98)';
               setTimeout(() => {
                 path.style.transform = 'scale(1.02)';
               }, 100);
               handleClick(stateCode);
             });
            
            console.log(`✅ Estado ${stateCode} (${stateNames[stateCode]}) configurado com ${jobCount} vagas`);
          }
        });
        
      } catch (error) {
        console.error('❌ Erro ao processar mapa:', error);
      }
    }
  }, [stateJobCounts, isLoading]);

  // Escala de cores moderna e vibrante baseada na quantidade de vagas
  const getColorForValue = (value) => {
    if (value === 0) return '#f8fafc'; // Branco suave
    if (value <= 10) return '#e0f2fe'; // Azul muito claro
    if (value <= 50) return '#bae6fd'; // Azul claro
    if (value <= 100) return '#7dd3fc'; // Azul médio claro
    if (value <= 200) return '#38bdf8'; // Azul médio
    if (value <= 500) return '#0ea5e9'; // Azul vibrante
    if (value <= 1000) return '#0284c7'; // Azul forte
    if (value <= 2000) return '#0369a1'; // Azul escuro
    return '#075985'; // Azul muito escuro
  };

  // Função para obter cor com gradiente
  const getGradientColor = (value, stateCode) => {
    const baseColor = getColorForValue(value);
    return `linear-gradient(135deg, ${baseColor} 0%, ${adjustBrightness(baseColor, -10)} 100%)`;
  };

  // Função auxiliar para ajustar brilho da cor
  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  // Dados para a legenda
  const legendData = [
    { range: 'Mais de 2.000 vagas', color: '#075985', count: Object.values(stateJobCounts).filter(v => v > 2000).length },
    { range: '1.000 - 2.000 vagas', color: '#0369a1', count: Object.values(stateJobCounts).filter(v => v > 1000 && v <= 2000).length },
    { range: '500 - 1.000 vagas', color: '#0284c7', count: Object.values(stateJobCounts).filter(v => v > 500 && v <= 1000).length },
    { range: '200 - 500 vagas', color: '#0ea5e9', count: Object.values(stateJobCounts).filter(v => v > 200 && v <= 500).length },
    { range: '100 - 200 vagas', color: '#38bdf8', count: Object.values(stateJobCounts).filter(v => v > 100 && v <= 200).length },
    { range: '50 - 100 vagas', color: '#7dd3fc', count: Object.values(stateJobCounts).filter(v => v > 50 && v <= 100).length },
    { range: '10 - 50 vagas', color: '#bae6fd', count: Object.values(stateJobCounts).filter(v => v > 10 && v <= 50).length },
    { range: '1 - 10 vagas', color: '#e0f2fe', count: Object.values(stateJobCounts).filter(v => v > 0 && v <= 10).length },
    { range: 'Sem vagas', color: '#f8fafc', count: Object.values(stateJobCounts).filter(v => v === 0).length }
  ];

  if (isLoading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Carregando mapa do Brasil...</p>
      </div>
    );
  }

  return (
    <div className="interactive-map-wrapper">
      <div className="map-header">
        <h3>🗺️ Mapa Interativo - Vagas por Estado</h3>
        <p>Clique nos estados para ver detalhes • Passe o mouse para informações rápidas</p>
      </div>
      
      <div className="map-content">
        <div 
          ref={mapRef}
          className="brazil-map-container interactive map-container brazil-map" 
          style={{ width: '100%', height: 'auto', position: 'relative' }}
        />
        
        {/* Tooltip */}
        {tooltip.visible && (
          <div 
            className="tooltip"
            style={{
              position: 'absolute',
              left: tooltip.x + 15,
              top: tooltip.y - 15,
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(7, 89, 133, 0.95) 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              pointerEvents: 'none',
              zIndex: 1000,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(-5px)',
              animation: 'tooltipFadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#60a5fa',
                boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)'
              }}></div>
              {tooltip.content}
            </div>
          </div>
        )}
        
        {/* Legenda */}
        <div className="map-legend">
          <h4 style={{ 
            marginBottom: '16px', 
            color: '#1e40af', 
            fontWeight: '700',
            fontSize: '18px'
          }}>Legenda</h4>
          <div className="legend-items">
            {legendData.map((item, index) => (
              <div key={index} className="legend-item" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div 
                  className="legend-color" 
                  style={{ 
                    backgroundColor: item.color,
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    marginRight: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.8)'
                  }}
                ></div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }} className="legend-label">{item.range}</span>
                {item.count !== undefined && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>({item.count})</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Estatísticas do mapa */}
          <div className="map-stats">
            <div className="stat-item">
              <strong>Total de Estados:</strong> {Object.keys(stateJobCounts).length}
            </div>
            <div className="stat-item">
              <strong>Total de Vagas:</strong> {Object.values(stateJobCounts).reduce((a, b) => a + b, 0).toLocaleString('pt-BR')}
            </div>
            <div className="stat-item">
              <strong>Vagas Processadas:</strong> {jobData ? jobData.length.toLocaleString('pt-BR') : '0'}
            </div>
            {selectedState && (
              <div className="stat-item selected-state">
                <strong>Selecionado:</strong> {stateNames[selectedState]} ({stateJobCounts[selectedState]?.toLocaleString('pt-BR') || 0} vagas)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrazilMap;