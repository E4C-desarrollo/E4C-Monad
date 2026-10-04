Markdown# E4C (Education for Culture)
Infraestructura digital descentralizada y pedagógica diseñada para mitigar el ausentismo escolar, eliminar la carga administrativa docente y conectar el mérito académico con oportunidades culturales y formativas.

## Índice
- Problema que Resuelve
- Arquitectura del Sistema
- Módulos Principales
- Stack Tecnológico
- Privacidad y Marco Legal (Ley 25.326)
- Instalación y Configuración Local
- Variables de Entorno
- Despliegue de Smart Contracts (Monad / EVM)
- Roadmap
- Licencia

## Problema que Resuelve
Las escuelas secundarias públicas enfrentan tres cuellos de botella estructurales:
- **Pérdida de tiempo pedagógico:** La toma de asistencia analógica y la carga duplicada en múltiples sistemas consumen horas lectivas semanales.
- **Uso pasivo de la Inteligencia Artificial:** La adopción no mediada de LLMs fomenta el plagio pasivo (copy-paste) y elude la elaboración cognitiva de los contenidos.
- **Falta de incentivos tangibles:** El esfuerzo sostenido, la regularidad y el compromiso académico no cuentan con canales directos de articulación con el ecosistema cultural y laboral.

E4C resuelve estas fricciones integrándose como una capa no disruptiva sobre la infraestructura existente (Google Classroom / Google Workspace for Education), sin exigir doble carga administrativa y operando con registro descentralizado e inmutable de atestaciones académicas.

## Arquitectura del Sistema
```plaintext
       [ Docente / Aula ]                      [ Estudiante ]
        /              \                             |
  Voz / Manual       Google Classroom API      Google Classroom
      |                     |                        |
[ Edge Functions ] <--- Webhooks & Auth -------- [ App Web E4C ]
      |                                              |
      +---> [ Supabase / Postgres ]             Tutor Socrático (IA)
      |     (Datos PII cifrados)                     |
      |                                              v
      +---> [ Monad RPC Node ] ---------> [ Monad Smart Contracts ]
                                              (Monad Blockchain)
                                              - Proof of Merit
                                              - Bóveda Colectiva
                                              - QR Dinámico (Pases)
Módulos Principales1. Integración Nativa con Google ClassroomGenerador de Desafíos con IA: Asiste al docente en el diseño de consignas a partir del currículum escolar.Sincronización Bidireccional: Publicación directa de actividades en el Classroom oficial del curso y retorno automático de calificaciones y estados de entrega.Cero Carga Duplicada: No sustituye los canales institucionales vigentes.2. Tutor SocráticoMediación pedagógica algorítmica frente a modelos de lenguaje.Detección de patrones de texto prefabricados o copiados.Intervención mediante repreguntas dialécticas (mayéutica): obliga al estudiante a argumentar y justificar el razonamiento antes de habilitar la entrega.3. Registro Ágil de AsistenciaEntrada por Voz: Dictado natural del parte de clase procesado localmente en menos de 45 segundos.Entrada Manual por Excepción: Marcación rápida de ausencias en tres clics.Trazabilidad en Vivo: Panel online inmediato para docentes, preceptores y equipo directivo.Modo Offline-First: Persistencia local garantizada ante cortes de conectividad escolar con sincronización posterior.4. Reconocimiento y Bóveda ColectivaAcreditación de Mérito Escolar: Registro auditable, de alta concurrencia y ultrarrápido sobre la red Monad.Bóveda Colectiva: Fondo de incentivos grupales por división para desbloquear actividades y salidas conjuntas basadas en el presentismo y rendimiento del curso.Canje mediante QR Dinámico: Emisión de credenciales de un solo uso para experiencias culturales y pasantías formativas, sin intermediación financiera ni exposición a tokens de especulación.Stack TecnológicoCapaTecnologíaPropósitoFrontendReact, Vite, Tailwind CSSInterfaz web responsiva optimizada para dispositivos móvilesBackendNode.js, Express, Python / FlaskProcesamiento de NLP y microservicios de mediaciónBase de DatosSupabase, PostgreSQLAlmacenamiento relacional y autenticación institucionalSmart ContractsSolidity (Hardhat / Foundry)Lógica de atestación, control de límites y bóvedas colectivas en EVMBlockchainMonad NetworkEjecución paralela de alta velocidad, bajo costo y finalidad instantáneaIntegracionesGoogle Classroom API, Google OAuthSincronización de cursos, tareas y calificacionesPrivacidad y Marco Legal (Ley 25.326)E4C se rige bajo el principio de Soberanía y Minimización de Datos:Cumplimiento de la Ley Nacional de Protección de Datos Personales (Ley 25.326) de la República Argentina.Custodia Exclusiva: La titularidad de los datos personales (PII) pertenece a la institución educativa, al alumno y a los tutores legales a los que el alumno habilite acceso explícito.Atestaciones Criptográficas Anónimas: Ningún dato identificatorio (nombre, DNI, fotografía) se registra en la blockchain. La red pública solo almacena hashes criptográficos y pruebas matemáticas que verifican la autenticidad del mérito sin revelar la identidad subyacente.Instalación y Configuración LocalPrerrequisitosNode.js >= 20.xFoundry o Hardhat (para gestión de contratos EVM)Docker (opcional, para emular nodo local de Supabase)1. Clonar el repositorioBashgit clone [https://github.com/org-mock/e4c-core.git](https://github.com/org-mock/e4c-core.git)
cd e4c-core
2. Configurar el Frontend y BackendBash# Instalar dependencias del cliente y servidor
npm install

# Iniciar servidor de desarrollo
npm run dev
3. Entorno de Smart ContractsBash# Compilar contratos en Solidity mediante Foundry
forge build
Variables de EntornoCrear un archivo .env en la raíz del proyecto tomando como referencia .env.example:Ini, TOML# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Google Classroom API
GOOGLE_CLIENT_ID=mock_client_id_123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=mock_client_secret_xyz
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Supabase / Base de Datos
SUPABASE_URL=[https://mock-project.supabase.co](https://mock-project.supabase.co)
SUPABASE_ANON_KEY=mock_supabase_anon_key_abc
SUPABASE_SERVICE_ROLE_KEY=mock_supabase_service_key_xyz

# Monad Network / EVM
MONAD_RPC_URL=[https://testnet-rpc.monad.xyz](https://testnet-rpc.monad.xyz)
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
MERIT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
Despliegue de Smart Contracts (Monad)Configurar la red y desplegar usando Foundry:Bash# Compilar los contratos
forge compile

# Desplegar en la testnet de Monad
forge create --rpc-url [https://testnet-rpc.monad.xyz](https://testnet-rpc.monad.xyz) \
  --private-key $DEPLOYER_PRIVATE_KEY \
  src/E4CMerit.sol:E4CMerit
Roadmap[x] Validación de pilotos en escuelas secundarias locales.[x] Presentación y participación en hackathons de desarrollo regional.[x] Selección e ingreso a programas de incubación institucional.[ ] Migración e integración de contratos inteligentes optimizados para la ejecución paralela de Monad.[ ] Lanzamiento del módulo de Asistencia Offline-First con sincronización en segundo plano.[ ] Formalización de convenios con el sector cultural para canje de pases mediante QR dinámico.[ ] Auditoría formal de smart contracts para despliegue en Mainnet.LicenciaDistribuido bajo la Licencia Apache 2.0. Consulte el archivo LICENSE para más información.
