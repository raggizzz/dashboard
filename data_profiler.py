import json
from collections import Counter
import re

def analyze_salary(salary_str):
    if salary_str is None or salary_str.lower() == 'a combinar':
        return None
    numbers = re.findall(r'\d+\.?\d*', salary_str.replace('.', '').replace(',', '.'))
    numbers = [float(n) for n in numbers]
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

def profile_jobs_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Erro: Arquivo '{file_path}' não encontrado.")
        return
    except json.JSONDecodeError:
        print(f"Erro: Falha ao decodificar JSON do arquivo '{file_path}'.")
        return

    print(f"Total de vagas encontradas: {len(data)}\n")

    # Análise de Cargos
    cargos = [job.get('Cargo', 'N/A') for job in data]
    cargo_counts = Counter(cargos)
    print("--- Análise de Cargos ---")
    print(f"Total de cargos únicos: {len(cargo_counts)}")
    print("Top 10 cargos mais comuns:")
    for cargo, count in cargo_counts.most_common(10):
        print(f"  {cargo}: {count}")
    print("\n")

    # Análise de Empresas
    empresas = [job.get('Empresa', 'N/A') for job in data]
    empresa_counts = Counter(empresas)
    print("--- Análise de Empresas ---")
    print(f"Total de empresas únicas: {len(empresa_counts)}")
    print("Top 10 empresas com mais vagas:")
    for empresa, count in empresa_counts.most_common(10):
        print(f"  {empresa}: {count}")
    print("\n")

    # Análise de Localização
    localizacoes = [job.get('Localização', 'N/A') for job in data]
    localizacao_counts = Counter(localizacoes)
    print("--- Análise de Localização ---")
    print(f"Total de localizações únicas: {len(localizacao_counts)}")
    print("Valores mais comuns para Localização:")
    disponivel_count = 0
    nao_disponivel_count = 0
    outras_localizacoes_exemplos = []
    for loc, count in localizacao_counts.most_common():
        if loc.lower() == 'localização não disponível':
            nao_disponivel_count = count
        else:
            disponivel_count += count
            if len(outras_localizacoes_exemplos) < 5 and loc != 'N/A':
                outras_localizacoes_exemplos.append(loc)
    print(f"  'Localização não disponível': {nao_disponivel_count} ocorrências")
    print(f"  Outras localizações (válidas ou N/A): {disponivel_count} ocorrências")
    if outras_localizacoes_exemplos:
        print("  Exemplos de outras localizações:")
        for ex in outras_localizacoes_exemplos:
            print(f"    - {ex}")
    print("\n")

    # Análise de Salários
    salarios_str = [job.get('Salário') for job in data]
    salarios_processados = []
    combinar_count = 0
    valid_salary_count = 0
    invalid_format_examples = []

    for s_str in salarios_str:
        if s_str is None or isinstance(s_str, str) and s_str.lower() == 'a combinar':
            combinar_count += 1
        else:
            salario_num = analyze_salary(s_str)
            if salario_num is not None:
                salarios_processados.append(salario_num)
                valid_salary_count += 1
            elif isinstance(s_str, str) and len(invalid_format_examples) < 5:
                invalid_format_examples.append(s_str)
    
    print("--- Análise de Salários ---")
    print(f"Total de salários 'A combinar': {combinar_count}")
    print(f"Total de salários com valor numérico: {valid_salary_count}")
    if salarios_processados:
        salario_medio = sum(salarios_processados) / len(salarios_processados)
        print(f"Salário médio (calculado dos válidos): R$ {salario_medio:,.2f}")
        print(f"Menor salário (calculado dos válidos): R$ {min(salarios_processados):,.2f}")
        print(f"Maior salário (calculado dos válidos): R$ {max(salarios_processados):,.2f}")
    else:
        print("Não foi possível calcular estatísticas de salário (sem valores numéricos válidos).")
    if invalid_format_examples:
        print("Exemplos de formatos de salário não processados automaticamente:")
        for ex_sal in invalid_format_examples:
            print(f"  - {ex_sal}")
    print("\n")

    # Análise de Fontes
    fontes = [job.get('Fonte', 'N/A') for job in data]
    fonte_counts = Counter(fontes)
    print("--- Análise de Fontes ---")
    print(f"Total de fontes únicas: {len(fonte_counts)}")
    print("Contagem por fonte:")
    for fonte, count in fonte_counts.most_common():
        print(f"  {fonte}: {count}")
    print("\n")

if __name__ == '__main__':
    profile_jobs_data('vagas_resultado_20250424_160009.json')