# CONCEPTS.md — Fundamental Principles of the Ecosystem

> **Note:**
> The concepts defined here are the fundamental laws of the Slice ecosystem.
> They can only be changed in exceptional circumstances, such as:
>
> - Structural change (e.g. increased resources, new infrastructure, investment entry).
> - Discovery of a proven superior solution for the concept's objective.
>
> **We never go backwards:**
> Changes are only accepted if they improve, simplify or strengthen the concept.
> We never go back to a less robust, less flexible or less secure state.

## 1. Low Resource & Minimum Cost

- The project should start from the principle that **there is little resource available** (financial and computational).
- **Offline first:** Prioritize solutions that work locally, without relying on paid cloud or external services.
- **Open source whenever possible:** Tools, frameworks and models should be open source, avoiding lock-in and recurring costs.
- The maximum allowed external dependency is something like Cursor IDE or some open source MLLMs (e.g. Phi, Mistral, etc.), but always seeking the **lowest cost possible**.
- **Hardware and budget restrictions** should be considered in every technical decision.

> This concept is the foundation for all future choices: architecture, tools, automation and even project culture.

#### LOCAL – workstation - 192.168.100.20 - Manager

- CPU: Intel Core i5-13400 (13th generation), 16 threads, 10 cores, up to 4.6 GHz
- RAM: 62 GB DDR4
- Disk:
  - /dev/sdb3 (root): 900 GB (152 GB used)
    - **Note:** Even though there is space, the main HD (root) should be kept free and only used for temporary work. No production or final data here!
  - /dev/md0 (/media/data): 898 GB (699 GB used)
    - **Production space:** All ready-to-go data/projects should be moved here.
  - /dev/sda1 (/mnt/backup): 932 GB (71 GB used)
- GPU: NVIDIA GeForce RTX 4060, 8 GB VRAM, driver 570.133.07, CUDA 12.8

#### SERVER – localcloud - 192.168.100.10 - Worker

- CPU: 2× Intel Xeon E5-2680 v4, 56 threads, 28 cores, up to 2.4 GHz
- RAM: 62 GB DDR4
- Disk:
  - /dev/sda3 (root): 211 GB (17 GB used)
    - **Note:** Do not use for production, only OS and temporaries.
  - /dev/mapper/vg0-lv--0 (/media/data): 932 GB (18 GB used)
    - **Production space:** Final data/projects go here.
- GPU: AMD Radeon RX 580 2048SP (Polaris 20 XL), driver amdgpu, 8 GB VRAM

---

## 📦 Storage Strategy

- **/media/data** on both machines is the production space.
- The system OS disk (root) should only be used for temporary work, never for final data.
- This ensures quick reinstallation of the OS without risk of production loss.

---

## 🛠️ Workflow Policy: GitHub + Makefile

- **All code must be on GitHub** — versioning, collaboration and traceability guaranteed.
- **Easy rebuild:** Everything should be easily rebuilt from the repository, without obscure manual steps.
- **Makefile is mandatory and controls everything:**
  - Installation (`install`), development (`dev`), production (`start`/`prod`), testing (`test`), cleaning (`clean`), logs, shell, etc.
  - The standard Makefile is defined in [MAKE_FILES.md](docs/MAKE_FILES.md) and should be followed in all projects/stacks.
- **Simple flow:**
  - Downloaded from GitHub? Just run the Makefile to install, run, test, etc.
  - If it breaks, just clone and rebuild quickly — without dependency on manual environment.
- **Any project that cannot be controlled 100% by the Makefile is out of standard!**

---

## ❓ Question for the user

- Is there any other directory/device that can be used for production, or is **/media/data** the only official source?
- How do you prefer to organize the flow of "temporary work" vs. "final production"?
- Do you want to automate the movement of files from root to /media/data?
- Any backup/routine policy for the external HD or Dropbox?

[CONCEPT] Flexibility and Adaptability

> Every technological choice in the Slice ecosystem prioritizes flexibility, modularity and independence.
> Frameworks will never be preferred over libraries.
> The goal is to ensure that the stack is always adaptable, resilient and under total control of the team.
>
> **Note about Python IA:**
> Python IA does not understand "magic" of opinionated frameworks. The more explicit, modular and based on libraries the stack is, the easier it is to automate, debug and evolve the system. Frameworks that impose rigid concepts, hidden conventions or depend on "dependency injection" make automation and maintenance difficult. The Slice ecosystem always prioritizes simple, transparent stacks under total control of the team and Python IA.

## [CONCEPT] Standard Documentation for Each Aspect

> **For each aspect of the Slice ecosystem (routes, components, scripts, CI/CD, etc.), there is a reference document that defines:**
>
> - The official standard ("right way")
> - Usage examples
> - What is forbidden (anti-patterns)
> - How to validate (checklist, linter, tests)
>
> **Practical example:**
> If you are creating an Express router, there is a document (e.g. `docs/backend/routers.md`) that shows:
>
> - File and folder structure
> - How to import and export routes
> - How to document endpoints
> - How to apply middlewares
> - Approved code example
> - Validation checklist (prettier, linter, tests)

### Example of structure for `docs/backend/routers.md`

[CONCEPT] Plug-and-Play Total for Modules

> Every module in the Slice ecosystem must be totally plug-and-play.
>
> - When cloning/downloading the repository, just run the `make install` (or default command defined) and everything should work automatically, without needing manual adjustments, extra configurations or hacks.
> - The Makefile is the only entry point for installation, configuration, build, tests and execution of the module.
> - If the module requires system dependencies (Linux), the Makefile should install/configure everything automatically.
> - If it does not work 100% plug-and-play, the module is rejected until it is fixed.
> - This applies to all modules: backend, frontend, automation, CI/CD, etc.
> - This ensures reusability, automation, traceability and easy maintenance throughout the ecosystem.

[CONCEPT] Preference for Well-Typed and Flexible Libraries

> Whenever possible, the Slice ecosystem should adopt libraries (such as modelfusion) that are well-typed, flexible and do not impose coupling or mandatory structure.
>
> - Libraries of this type allow composing, integrating and adapting flows and models according to need, without "magic" or dependency on platform.
> - The unique connector of the ecosystem should be implemented with these libraries, ensuring easy, predictable and standardized integration for all agents (humans, AI, automations).
> - Opinionated frameworks or those that impose structure will never be preferred over modular and typed libraries.

[CONCEPT] Single Responsibility and Encapsulation of Modules

> Each module in the Slice ecosystem has a clear, unique and well-defined function.
>
> - The module must be totally encapsulated: it only exposes its official interface, without leaking internal details or dependencies.
> - If the same tool is used in more than one module, each use is independent and serves different purposes (e.g. providing AI model vs. training AI).
> - There is no problem in having redundant tooling, as long as each module maintains its single responsibility and there is no coupling between them.
> - The goal is to ensure clarity, easy maintenance, reusability and independent evolution of the modules.

[CONCEPT] 100% Guided Installation, Tested and Informative

> When running `make install` in any module of the Slice ecosystem:
>
> - The entire installation, configuration and initialization process should be automatic and without manual intervention.
> - At the end, the user should receive clear and objective information, such as:
>   - Access URL (if it is a web service)
>   - Usage commands (if it is CLI)
>   - Status of each step (installed dependencies, service up, ran tests, etc.)
> - The Makefile should run all necessary tests to ensure that the module is working perfectly.
> - If any test fails, the installation is interrupted and the error is displayed clearly.
> - The goal is to ensure that, at the end of the process, the user is sure that everything is working and knows exactly how to access/use the module.

[CONCEPT] Strong, Standardized and Inherited Validation

> The entire Slice ecosystem should adopt strong and standardized validation of data and parameters:
>
> - **TypeScript/Node:** The standard is the use of Zod for schemas, validation and typing, always inheriting from base/abstract classes to ensure consistency and reuse.
> - **Python:** It is mandatory to use JSON Schema, as Zod imports/exports JSON Schema, ensuring compatibility between languages and validation throughout the ecosystem.
> - Any class/module that manipulates data, integrations or configurations should inherit validation from the base/abstract, never implementing manual or ad hoc validation.
> - This ensures predictability, security, automation and easy integration between modules, languages and agents (humans or AI).
> - Any module without strong and standardized validation is out of Slice standard.

[CONCEPT] Every Standard Has Real Justification

> In the Slice ecosystem, **every tool, library, standard or flow choice must be justified by real tests, benchmarks or practical needs of the project**.
> - We do not adopt anything by fashion, hype or external convention without own validation.
> - Always document the reason for the choice, preferably with examples, tests or comparisons.
> - Example: In Express projects, we use `colorette` for terminal colors, as `chalk` in recent versions is ESM-only and causes compatibility issues. Every decision of this type is recorded and justified.
> - If a better solution appears, we only change after new test and reason registration.
> - This ensures traceability, continuous learning and avoids arbitrary or contextless decisions.

[CONCEITO] Claude 4 e Variantes Banidas

> Claude 4 e todas as suas variantes estão banidas do ecossistema Slice.
> - Não podem ser usadas em nenhum processo, automação, integração, benchmark ou seleção de modelos/agents IA.
> - A decisão é definitiva, baseada em critérios técnicos, éticos e de alinhamento com os objetivos do projeto.
> - Qualquer tentativa de uso, integração ou sugestão de Claude 4 será rejeitada automaticamente.

```markdown
# Official Standard for Express Routers

## File Structure
- Each resource has its own router file in `src/routes/`
- Example: `src/routes/userRouter.js`
```
