# Smart Portfolio Optimiser

<div id="top"></div>

<!-- PROJECT SHIELDS -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Smart Portfolio Optimiser Frontend</h3>

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
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-the-front-end">Running the Frontend</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Project Features

1. Portfolio Creator and Editor
1. Portfolio Analyzer for Standard Metrics
1. Portfolio Optimiser for Risk and Return
1. Portfolio Interactive Charts
1. Portfolio Rules
1. Porfolio Rules Logs

### Built With

-   [Next.js](https://nextjs.org/)

### Key Libraries Used

1. [Shadcn/ui](https://ui.shadcn.com/)
2. [Recharts](https://recharts.org/en-US/)
3. [Zustand](https://github.com/pmndrs/zustand)
4. [Socket.IO](https://socket.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Before you can run the application, you must have the following installed

-   Node
-   NPM

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
4. Run the Frontend:
    ```sh
    npm run dev
    ```
5. The frontend can be accessed at:
    ```sh
    http://localhost:3000/
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Screenshots

### Dashboard

![App Overview][portfolio-dashboard]

### Portfolio

![Create Portfolio][create-portfolio]
![Create Order][create-order]
![Transaction][transaction]

### Finance news

![Finance News Dashboard][finance-news-dashboard]
![Individual Finance News][individual-news]

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[dashboard]: images/dashboard.png
[portfolio-dashboard]: ../images/portfolio-dashboard.png
[create-portfolio]: ../images/create-portfolio.png
[create-order]: ../images/create-order.png
[transaction]: ../images/transaction.png
[finance-news-dashboard]: ../images/finance-news-dashboard.png
[individual-news]: ../images/individual-finance-news.png
