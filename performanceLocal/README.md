# OR Solver Benchmarking Tool

## Description

The OR Solver Benchmarking Tool is an integral part of the main OR Solver project, designed to compare the performance of various Operations Research solvers. When the benchmarking API is running locally on port 8080, the main project's `/benchmark/` page will query this API and include its results in the performance comparison. If the API is not accessible, the benchmark will only consider results from browser-based solver implementations.

This tool provides valuable insights into solver efficiency across various problem types and sizes, supporting both native installations and web-based implementations. Currently, it supports LP and GMPL problem formats.

**Important:** This benchmarking tool is designed to work with a local installation of the main OR Solver project, not with the Docker container version. Ensure you have set up the main project locally as per its README before using this benchmarking tool.

## Features

- Compares performance of multiple solvers (GLPK, HiGHS)
- Supports LP and GMPL problem formats
- Provides execution time and solution time metrics
- Integrates with the main OR Solver web interface when available
- Falls back to browser-only benchmarking when the local API is not accessible

## Prerequisites

- Python 3.7+
- GLPK and HiGHS solvers installed on your system
- Local installation of the main OR Solver project

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/mst2k/programmierprojekt.git
   ```

2. Navigate to the performanceLocal directory:
   ```
   cd programmierprojekt/performanceLocal
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Install the required solvers:
    - For macOS:
      ```
      brew install glpk highs
      ```
    - For Ubuntu/Debian:
      ```
      sudo apt-get install glpk-utils highs
      ```
    - For Windows, please refer to the respective solver documentation for installation instructions.

## Usage

1. Ensure the main OR Solver project is set up and running locally (not in Docker).

2. Start the benchmarking API:
   ```
   python ./benchmark_runner.py
   ```
   This will start the API on port 8080.

3. Access the benchmarking results through the main OR Solver web interface at `/benchmark/`.

## Contributing

Contributions to improve the benchmarking tool are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- University of Applied Sciences Osnabrück for academic support
- The open-source community for the solvers used in this project

---

For more information on the main OR Solver project, please refer to the [main README](../README.md).