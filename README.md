# MangaMatch: Manga Recommendation Engine

MangaMatch is an recommendation engine aiming to help manga enthusiasts discover series tailored to their individual tastes.

## Features

- **Multi-Manga Input**: Allows users to input multiple manga titles they've enjoyed to generate more nuanced recommendations.
- **Advanced Recommendation Algorithm**: Utilizes a vectorization strategy based on genres, themes, and other fields. Employs cosine similarity for determining manga similarity.
- **Selective Exploration**: Introduces an element of randomness to occasionally suggest lesser-known manga or titles that slightly diverge from the user's typical preferences.

## Tech Stack

- **Frontend**: React (To be implemented)
- **Backend**: Express.js on Node.js
- **Database**: MongoDB
- **State Management**: Redux (planned for future updates)

## Quick Start

1. **Clone the repository**:
    ```bash
    git clone https://github.com/csiv23/MangaMatch.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd MangaMatch
    ```

3. **Install dependencies**:
    ```bash
    npm install
    cd client && npm install
    ```

4. **Set up environment variables**:
    Copy `.env.sample` to `.env` and populate the necessary variables.

5. **Run the application**:
    ```bash
    npm run dev
    ```

## Upcoming Features

- User rating-based recommendations

## Feedback & Contributions

Feedback, bug reports, and pull requests are welcome. Feel free to check [issues](https://github.com/csiv23/MangaMatch/issues) for any upcoming features or bugs to tackle.

