import json
import pandas as pd
from collections import Counter
import re

# Carregar dados
with open('vagas_resultado_20250424_160009.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Análise de cargos
cargos_count = df['Cargo'].value_counts()
print('=== ANÁLISE DE CARGOS ===')
print(f'Total de vagas: {len(df)}')
print(f'Tipos de cargo únicos: {len(cargos_count)}')
print('\nTop 10 cargos:')
for cargo, count in cargos_count.head(10).items():
    print(f'{cargo}: {count} vagas')

# Análise de empresas
empresas_count = df['Empresa'].value_counts()
print('\n=== ANÁLISE DE EMPRESAS ===')
print(f'Empresas únicas: {len(empresas_count)}')
print('\nTop 10 empresas que mais contratam:')
for empresa, count in empresas_count.head(10).items():
    print(f'{empresa}: {count} vagas')

# Análise de salários
salarios_validos = df[df['Salário'] != 'A combinar']['Salário']
print('\n=== ANÁLISE DE SALÁRIOS ===')
print(f'Vagas com salário definido: {len(salarios_validos)}')
print(f'Vagas com salário a combinar: {len(df[df["Salário"] == "A combinar"])}')

# Análise de localização
localizacoes = df['Localização'].value_counts()
print('\n=== ANÁLISE DE LOCALIZAÇÃO ===')
print(f'Localizações únicas: {len(localizacoes)}')
print('\nTop 10 localizações:')
for loc, count in localizacoes.head(10).items():
    print(f'{loc}: {count} vagas')

# Análise de fontes
fontes = df['Fonte'].value_counts()
print('\n=== ANÁLISE DE FONTES ===')
for fonte, count in fontes.items():
    print(f'{fonte}: {count} vagas')

# Criar dados estruturados para o dashboard
dashboard_data = {
    'total_vagas': int(len(df)),
    'total_empresas': int(len(empresas_count)),
    'cargos_principais': {k: int(v) for k, v in cargos_count.head(6).items()},
    'empresas_principais': {k: int(v) for k, v in empresas_count.head(10).items()},
    'localizacoes_principais': {k: int(v) for k, v in localizacoes.head(10).items()}
}

# Salvar dados estruturados
with open('dashboard_data.json', 'w', encoding='utf-8') as f:
    json.dump(dashboard_data, f, ensure_ascii=False, indent=2)

print('\n=== DADOS SALVOS EM dashboard_data.json ===')
print(json.dumps(dashboard_data, ensure_ascii=False, indent=2))