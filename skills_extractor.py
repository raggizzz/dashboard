import json
import random

# Predefined skills for common job areas (example)
# These would ideally be more comprehensive and based on real-world data
SKILLS_BY_AREA = {
    "engenharia de software": ["Python", "Java", "JavaScript", "React", "Node.js", "SQL", "Git", "Docker", "AWS", "Microsserviços"],
    "ciência de dados": ["Python", "R", "SQL", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras", "Visualização de Dados"],
    "marketing digital": ["SEO", "SEM", "Google Analytics", "Marketing de Conteúdo", "Redes Sociais", "Email Marketing", "Copywriting", "Google Ads", "Facebook Ads"],
    "design gráfico": ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "UI/UX Design", "Tipografia", "Branding", "Design de Logotipo"],
    "recursos humanos": ["Recrutamento e Seleção", "Treinamento e Desenvolvimento", "Gestão de Desempenho", "Legislação Trabalhista", "Comunicação Interpessoal"],
    "finanças": ["Análise Financeira", "Modelagem Financeira", "Excel Avançado", "Contabilidade", "Mercado de Capitais"],
    "vendas": ["Prospecção", "Negociação", "CRM", "Técnicas de Vendas", "Comunicação Persuasiva"],
    "atendimento ao cliente": ["Comunicação Efetiva", "Resolução de Problemas", "Empatia", "Sistemas de Atendimento", "Paciência"],
    "gestão de projetos": ["Metodologias Ágeis", "Scrum", "Kanban", "Planejamento", "Gerenciamento de Riscos", "MS Project"],
    "professor de pedagogia": ["Didática", "Planejamento de Aulas", "Psicologia Educacional", "Legislação Educacional", "Inclusão Escolar", "Tecnologias Educacionais"],
    "desenvolvedor front-end": ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular", "TypeScript", "SASS", "Webpack"],
    "desenvolvedor back-end": ["Node.js", "Python (Django/Flask)", "Java (Spring)", "Ruby on Rails", "PHP (Laravel)", "Bancos de Dados (SQL/NoSQL)", "APIs RESTful"],
    "analista de sistemas": ["Levantamento de Requisitos", "Modelagem de Dados", "UML", "SQL", "Testes de Software", "Documentação Técnica"],
    "consultor": ["Análise de Negócios", "Gestão de Mudanças", "Planejamento Estratégico", "Comunicação", "Resolução de Problemas Complexos"],
    # Add more areas and skills as needed
}

GENERIC_SKILLS = ["Comunicação", "Trabalho em Equipe", "Proatividade", "Organização", "Resolução de Problemas", "Adaptabilidade"]


def get_skills_for_cargo(cargo_title):
    """Tries to match a cargo title to a predefined area and return its skills."""
    cargo_lower = cargo_title.lower()
    for area, skills in SKILLS_BY_AREA.items():
        if area in cargo_lower: # Simple substring matching
            return random.sample(skills, k=min(len(skills), random.randint(3, 5))) # Return 3-5 random skills
    return random.sample(GENERIC_SKILLS, k=min(len(GENERIC_SKILLS), random.randint(2, 4))) # Generic if no match

def main():
    input_file = 'vagas_resultado_20250424_160009.json'
    output_file = 'vagas_com_habilidades.json'

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            job_data = json.load(f)
    except FileNotFoundError:
        print(f"Erro: Arquivo de entrada '{input_file}' não encontrado.")
        return
    except json.JSONDecodeError:
        print(f"Erro: Falha ao decodificar JSON do arquivo '{input_file}'.")
        return

    processed_jobs = []
    for job in job_data:
        cargo = job.get("Cargo", "")
        if not cargo: # Handle cases where 'Cargo' might be missing or empty
            cargo = job.get("Título", "") # Try 'Título' as a fallback
        
        job_skills = get_skills_for_cargo(cargo if cargo else "genérico")
        job_with_skills = job.copy()
        job_with_skills['Habilidades'] = job_skills
        processed_jobs.append(job_with_skills)

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_jobs, f, ensure_ascii=False, indent=4)
        print(f"Arquivo '{output_file}' gerado com sucesso, contendo {len(processed_jobs)} vagas com habilidades.")
    except IOError:
        print(f"Erro: Não foi possível escrever no arquivo de saída '{output_file}'.")

if __name__ == '__main__':
    main()