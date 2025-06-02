import pandas as pd
import re
import json
from collections import defaultdict

# Ler o CSV
df = pd.read_csv('jobs_working.csv')

# Dicionário para mapear estados para regiões
state_to_region = {
    'AC': 'Norte', 'AP': 'Norte', 'AM': 'Norte', 'PA': 'Norte', 'RO': 'Norte', 'RR': 'Norte', 'TO': 'Norte',
    'AL': 'Nordeste', 'BA': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste', 'PB': 'Nordeste', 'PE': 'Nordeste', 'PI': 'Nordeste', 'RN': 'Nordeste', 'SE': 'Nordeste',
    'DF': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste',
    'ES': 'Sudeste', 'MG': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',
    'PR': 'Sul', 'RS': 'Sul', 'SC': 'Sul'
}

# Função para extrair cidade e estado
def extract_city_state(location):
    if pd.isna(location) or location == '':
        return None, None
    
    # Padrão para cidade / estado
    pattern = r'([^/]+)\s*/\s*([A-Z]{2})'
    match = re.search(pattern, location)
    
    if match:
        city = match.group(1).strip()
        state = match.group(2).strip()
        return city, state
    
    return None, None

# Processar dados
city_data = defaultdict(lambda: defaultdict(int))
region_data = defaultdict(int)
state_data = defaultdict(int)

for index, row in df.iterrows():
    location = row['location']
    area = row.get('area', 'Não especificado')
    
    city, state = extract_city_state(location)
    
    if city and state:
        region = state_to_region.get(state, 'Não identificado')
        
        # Contar vagas por cidade
        city_data[region][f"{city}, {state}"] += 1
        
        # Contar vagas por região
        region_data[region] += 1
        
        # Contar vagas por estado
        state_data[state] += 1

# Converter para formato JSON
result = {
    'cities_by_region': dict(city_data),
    'jobs_by_region': dict(region_data),
    'jobs_by_state': dict(state_data),
    'total_jobs': len(df)
}

# Salvar resultado
with open('cities_data.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Dados processados com sucesso!")
print(f"Total de vagas: {result['total_jobs']}")
print(f"Regiões encontradas: {list(result['jobs_by_region'].keys())}")
print(f"Estados encontrados: {len(result['jobs_by_state'])}")

# Mostrar algumas estatísticas
print("\nTop 10 cidades com mais vagas:")
all_cities = []
for region, cities in result['cities_by_region'].items():
    for city, count in cities.items():
        all_cities.append((city, count, region))

all_cities.sort(key=lambda x: x[1], reverse=True)
for city, count, region in all_cities[:10]:
    print(f"{city} ({region}): {count} vagas")