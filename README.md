# Smart Portfolio Optimiser

<div id="top"></div>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Smart Portfolio Optimiser</h3>

  <p align="center">
    A Fully Managed Portfolio Analyzer and Optimiser
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-features">Project Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#key-libraries-used">Key Libraries Used</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#caveats-and-notes">Caveats and Notes</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-the-front-end">Running the Frontend</a></li>
        <li><a href="#running-the-monolithic-back-end">Running the Backend</a></li>
        <li><a href="#running-the-microservices">Running the Microservices</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![App Overview][portfolio-dashboard]
![Create Portfolio][create-portfolio]
![Create Order][create-order]
![Transaction][transaction]
![Finance News Dashboard][finance-news-dashboard]
![Individual Finance News][individual-news]

### Project Features

1. Portfolio Creator and Editor
1. Portfolio Analyzer for Standard Metrics
1. Portfolio Optimiser for Risk and Return
1. Portfolio Interactive Charts
1. Portfolio Rules
1. Porfolio Rules Logs

### Built With

-   [Next.js](https://nextjs.org/)
-   [Nest.js](https://nestjs.com/)
-   [FastAPI](https://fastapi.tiangolo.com/)
-   [MongoDB Atlas](https://www.mongodb.com)

### Key Libraries Used (Frontend)

1. [Shadcn/ui](https://ui.shadcn.com/)
2. [Recharts](https://recharts.org/en-US/)
3. [Zustand](https://github.com/pmndrs/zustand)
4. [Socket.IO](https://socket.io/)

### Key Libraries Used (Backend)

1. [PyPortfolioOpt](https://github.com/robertmartin8/PyPortfolioOpt)
2. [LangGraph](https://github.com/langchain-ai/langgraph)
3. [Tavily](https://tavily.com/)
4. [OpenAI](https://platform.openai.com/docs/overview)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Before you can run the application, you must have the following installed

-   Node
-   NPM
-   Python3

### Caveats and Notes

1. This project uses MongoDB, and will not run unless the proper Environment Variables have been loaded.
2. This Project consists of both a Frontend and Backend. The Frontend runs on http://localhost:3000 while the Backend runs on http://localhost:8080.

### Installation

1. Clone the repo
    ```sh
    git clone https://github.com/ekcm/fyp.git
    ```

#### Running the Front End

1. Change Directory to the Frontend (/frontend)
2. Install NPM packages
    ```sh
    npm install
    ```
3. Duplicate a copy of `.env-example` in the same directory, and rename it to `.env.local`.
4. Run the Frontend
    ```sh
    npm run dev
    ```
5. The frontend can be accessed at:

```sh
http://localhost:3000/
```

#### Running the Monolithic Back End

1. Change Directory to the backend (/nestjs-backend)
2. Duplicate a copy of `.env-example` in the same directory and rename it to `.env`.
3. Fill in all the necessary details.
    1. MongoDB Details can be from when creating an Atlas Account.
4. Run the following to compile and run the application.

```sh
npm run start
```

5. Documentation: To get an overview of all available APIs, head to:

```sh
http://localhost:8080/api
```

### Running the Microservices

#### Optimiser Service

1.
2.
3.

#### Report Generation Service

1.
2.
3.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributors

This project was built by the following contributors:

Ang Wei Sheng - [Github](https://github.com/angweisheng)<br/>
Bryan Lee - [Github](https://github.com/bryanleezh)<br/>
Chester Chia - [Github](https://github.com/chesterchia)<br/>
Elijah Khor - [Github](https://github.com/ekcm)<br/>
Japheth Leong - [Github](https://github.com/japhethleongyh)<br/>
Klement Goh - [Github](https://github.com/klementgoh)<br/>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/quinncheong/goldman-sachs-portfolio-manager.svg?style=for-the-badge
[contributors-url]: https://github.com/quinncheong/goldman-sachs-portfolio-manager/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/quinncheong/goldman-sachs-portfolio-manager.svg?style=for-the-badge
[stars-url]: https://github.com/quinncheong/goldman-sachs-portfolio-manager/stargazers
[license-shield]: https://img.shields.io/github/license/quinncheong/goldman-sachs-portfolio-manager.svg?style=for-the-badge
[license-url]: https://github.com/quinncheong/goldman-sachs-portfolio-manager/blob/main/LICENSE.txt
[dashboard]: images/dashboard.png
[portfolio-dashboard]: images/portfolio-dashboard.png
[create-portfolio]: images/create-portfolio.png
[create-order]: images/create-order.png
[transaction]: images/transaction.png
[finance-news-dashboard]: images/finance-news-dashboard.png
[individual-news]: images/individual-finance-news.png
