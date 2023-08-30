# MangaMatch: Manga Recommendation Engine

MangaMatch is a recommendation engine designed to help manga enthusiasts discover new series based on their preferences.

## Features

- **User Input**: Allows users to input manga they've read and genres they prefer.
- **Recommendation Algorithm**: Provides suggestions based on genre-matching and manga similarity score (cosine similarity).
- **Refined Suggestions**: Occasionally introduces manga from slightly different genres or new authors.

## Tech Stack

- **Frontend**: React
- **Backend**: Express.js on Node.js
- **Database**: MongoDB
- **State Management**: Redux (optional, if you choose to add it later)

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
    Copy `.env.sample` to `.env` and fill in necessary variables.

5. **Run the application**:
    ```bash
    npm run dev
    ```

## Feedback & Contributions

Feedback, bug reports, and pull requests are welcome. Feel free to check [issues](https://github.com/csiv23/MangaMatch/issues) for any upcoming features or bugs to tackle.

