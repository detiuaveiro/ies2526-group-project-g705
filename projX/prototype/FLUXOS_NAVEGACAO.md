# SmartSense - Fluxos de Navegação e Demonstração

## Credenciais de Login

### Técnico de Manutenção (João Neves)
- **Username:** joao.neves
- **Password:** password
- **Navegação:** Dashboard, Máquinas, Pedidos de Ajuda

### Diretor de Manutenção (Manuel Gomes)
- **Username:** manuel.gomes
- **Password:** password
- **Navegação:** Dashboard, Histórico de Falhas, Gestão de Tarefas

### Analista (Carlos Silva)
- **Username:** analyst1
- **Password:** password
- **Navegação:** Dashboard, Máquinas, Rentabilidade

### Administrador (Sara Lopes)
- **Username:** sara.lopes
- **Password:** password
- **Navegação:** Dashboard, Máquinas, Gestão, Equipa, Rentabilidade, Arquivo

---

## Fluxos de Interação para Demonstração

### Fluxo 1: Alerta de Hazard (Técnico)
1. **Login** como João Neves (joao.neves / password)
2. No **Dashboard**, observar o **Alerta de Perigo - Limites Ultrapassados** (banner vermelho no topo)
3. Ver máquinas com vibração > 80 Hz, pressão > 110 bar ou temperatura > 90°C
4. Clicar em **Máquinas** na sidebar
5. Selecionar uma máquina com alerta (ex: Compressor Unit A1 ou Conveyor System D1)
6. Visualizar gráficos em tempo real de Vibração (Hz), Pressão (bar) e Temperatura (°C)
7. Clicar no botão **"Pedir Assistência"**
8. Preencher formulário:
   - ID da Máquina (auto-preenchido)
   - Localização (auto-preenchido)
   - Motivo da Ajuda
   - Timestamp (automático)
9. Enviar notificação em tempo real

### Fluxo 2: Gestão de Tarefas (Diretor)
1. **Login** como Manuel Gomes (manuel.gomes / password)
2. Clicar em **Gestão de Tarefas** na sidebar
3. Ver **Avisos de Erro Ativos** detectados pelo "Error Manager"
4. Para cada avaria:
   - Ver nome da máquina, localização e descrição da falha
   - Ver valores dos sensores (com cores semáforo)
5. Selecionar um **Técnico** no dropdown
6. Clicar em **"Atribuir Tarefa"**
7. Sistema cria registo de manutenção e envia notificação ao técnico

### Fluxo 3: Histórico de Falhas (Diretor)
1. **Login** como Manuel Gomes (manuel.gomes / password)
2. Clicar em **Histórico de Falhas** na sidebar
3. Ver tabela com:
   - Nome da máquina
   - Descrição da avaria
   - Lista de falhas anteriores ordenadas por data
   - Tempo de reparação
   - Custo total do reparo
4. Filtrar por máquina para ver histórico completo

### Fluxo 4: Painel de Rentabilidade (Admin/Analista)
1. **Login** como Sara Lopes (sara.lopes / password)
2. Clicar em **Rentabilidade** na sidebar
3. Ver estatísticas gerais:
   - Custo Total de reparações
   - Tempo Total gasto
   - Custo Médio por reparação
   - Tempo Médio de reparação
4. Fazer scroll para ver histórico por máquina com:
   - Data/hora da avaria
   - Tempo de reparação
   - Custo total do reparo

### Fluxo 5: Gestão CRUD de Máquinas (Admin)
1. **Login** como Sara Lopes (sara.lopes / password)
2. Clicar em **Gestão** na sidebar
3. Ver lista de máquinas ativas
4. **Adicionar Máquina:**
   - Clicar em "Adicionar Máquina"
   - Preencher formulário:
     - ID (automático)
     - Nome
     - Localização
     - Sensores associados
   - Máquina aparece na lista principal
5. **Arquivar Máquina:**
   - Clicar em "Arquivar" numa máquina
   - Máquina move-se para secção "Arquivadas"
6. **Eliminar Máquina:**
   - Na secção arquivada, clicar em "Eliminar"
   - Confirmar no modal
   - Ver mensagem: **"Equipment deleted successfully"**

### Fluxo 6: Ranking de Prioridade (Todos)
1. Login em qualquer conta
2. No **Dashboard**, ver secção **"Ranking de Prioridade - Máquinas Críticas"**
3. Máquinas ordenadas por prioridade (1 = mais alta)
4. Ver cores do sistema semáforo:
   - 🟢 **Verde:** Operacional
   - 🟡 **Amarelo:** Aviso
   - 🟠 **Laranja:** Crítico
   - 🔴 **Vermelho:** Avaria
5. Ver valores dos sensores com cores:
   - Verde: Valores normais
   - Amarelo: Valores em aviso
   - Vermelho: Valores críticos

---

## Sistema de Cores (Semáforo)

### Estados das Máquinas
- **Verde (Operacional):** Todos os sensores dentro dos limites normais
- **Amarelo (Aviso):** Alguns sensores próximos dos limites
- **Laranja (Crítico):** Sensores ultrapassaram limites, requer atenção
- **Vermelho (Avaria):** Máquina com falha, requer manutenção imediata

### Limites dos Sensores
- **Vibração:**
  - Verde: ≤ 60 Hz
  - Amarelo: 61-80 Hz
  - Vermelho: > 80 Hz

- **Pressão:**
  - Verde: ≤ 90 bar
  - Amarelo: 91-110 bar
  - Vermelho: > 110 bar

- **Temperatura:**
  - Verde: ≤ 70°C
  - Amarelo: 71-90°C
  - Vermelho: > 90°C

---

## Características Implementadas

### ✅ RBAC (Role-Based Access Control)
- Navegação adaptativa por cargo
- Permissões específicas por persona

### ✅ Dashboard com Alertas
- Alertas de Hazard visuais e proeminentes
- Gráficos em tempo real
- Sistema de cores semáforo

### ✅ Gestão de Tarefas
- Atribuição de técnicos
- Lista de avisos de erro
- Notificações em tempo real

### ✅ Histórico e Rentabilidade
- Histórico de falhas por máquina
- Análise de custos e tempos
- Tabelas com dados detalhados

### ✅ CRUD de Máquinas
- Adicionar, arquivar e eliminar
- Confirmação de exclusão
- Mensagens de sucesso

### ✅ Interface Intuitiva (NFR6)
- Design simples e limpo
- Navegação clara
- Feedback visual imediato

---

## Tecnologias Utilizadas
- **React** com TypeScript
- **Tailwind CSS v4**
- **shadcn/ui** componentes
- **Lucide React** ícones
- **Recharts** gráficos
- **Sonner** notificações
