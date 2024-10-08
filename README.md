<div align="center">

# OR Solver

<img src="./frontend/public/logo.svg" alt="OR Solver Logo" width="200" height="200">

Powerful web-based Operations Research problem solver

[![GitHub last commit](https://img.shields.io/github/last-commit/mst2k/programmierprojekt)](https://github.com/mst2k/programmierprojekt/commits/main)
[![GitHub issues](https://img.shields.io/github/issues-raw/mst2k/programmierprojekt)](https://github.com/mst2k/programmierprojekt/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/mst2k/programmierprojekt)](https://github.com/mst2k/programmierprojekt/pulls)
[![License](https://img.shields.io/github/license/mst2k/programmierprojekt)](https://github.com/mst2k/programmierprojekt/blob/main/LICENSE)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing) • [License](#license)

</div>

## Features

- 📊 Supports GMPL, LP, and MPS problem formats
- ⚡ Fast and efficient algorithms for quick solutions
- 🧩 Handles various OR problem types (General, Transport, Knapsack, Shift Plan)
- 🔧 Multiple solvers: GLPKHgourvest, GLPKJavil, Highs
- 🔄 Format conversion between different OR problem types
- 🌐 User-friendly web interface

## Demo

<div align="center">
  <img src="./frontend/public/demo_en.gif" alt="OR Solver Demo" width="600">
</div>

## Installation

### Docker (Recommended)

The easiest way to run the application is using Docker.

```bash
docker run -d -p 5174:5174 --name orsolver mastrohm/orsolver
```

Access the application at `http://localhost:5174`

### Local Installation

Alternatively, you can run the application locally. Follow the steps below.

1. Clone the repository:
   ```bash
   git clone https://github.com/mst2k/programmierprojekt.git
   cd programmierprojekt/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

To use the OR Solver:

1. Select the problem type (General, Transport, Knapsack, Shift Plan)
2. Choose a solver (GLPKHgourvest, GLPKJavil, Highs)
3. Input your problem in GMPL, LP, or MPS format
4. Click "Solve" to get results

## Development

To setup the development environment, follow the steps below.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

```bash
git clone https://github.com/mst2k/programmierprojekt.git
cd programmierprojekt/frontend
npm install
npm run dev
```

## Contributing

We welcome any contributions to the project.

### Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) guidelines. Examples:

- `feat: Add new user authentication`
- `fix: Resolve display issue in navigation bar`
- `docs: Update README with installation instructions`

## Tech Stack

- [Vite](https://vitejs.dev/) - Fast build tool
- [React](https://reactjs.org/) - UI library
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [react-i18next](https://react.i18next.com/) - Internationalization

## License

This project is licensed under the GNU General Public License. See the [LICENSE](LICENSE) file for details.

Note: The solvers used in this project are from other open-source projects. We've built a web interface around these existing solvers.

## Acknowledgments

- University of Applied Sciences Osnabrück for academic support
- All contributors to the project
- The open-source community for the solvers that power our application

---

<br/>
<div align="center">
  <strong>OR Solver</strong> - Developed with ❤️ by students at the University of Applied Sciences Osnabrück
</div>