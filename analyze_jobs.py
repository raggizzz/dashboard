import json
from collections import Counter

with open('vagas_resultado_20250424_160009.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cargos = [item['Cargo'] for item in data]
cargo_counts = Counter(cargos)

print('Top job categories:')
for cargo, count in cargo_counts.most_common(20):
    print(f'{cargo}: {count}')

print(f'\nTotal unique job categories: {len(cargo_counts)}')
print(f'Total job listings: {len(data)}')