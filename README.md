# MangaMatch: Manga Recommendation Engine

MangaMatch is an recommendation engine aiming to help manga enthusiasts discover series tailored to their individual tastes.

## Features

- **Multi-Manga Input**: Allows users to input multiple manga titles they've enjoyed to generate more nuanced recommendations.
- **Advanced Recommendation Algorithm**: Leverages one-hot encoding for streamlined genre categorization, and applies cosine similarity metrics for accurate manga-to-manga comparisons across multiple atributes like genres and themes.
- **Selective Exploration**: Introduces an element of randomness to occasionally suggest lesser-known manga or titles that slightly diverge from the user's typical preferences.
- **Optimal Batch Processing**: Employs a dynamic batch size to expedite the computation of similar manga, fine-tuning the recommendation engine's performance.



## Tech Stack

- **Frontend**: React (To be implemented)
- **Backend**: Express.js on Node.js
- **Database**: MongoDB
- **State Management**: Redux (planned for future updates)


## What I Learned

- **MongoDB**: Beyond just basic CRUD operations, I learned about data modeling and schema design, specifically the challenges of handling hierarchical data. I've also done some data cleaning through MongoDB to prepare the database for vectorization.
  
- **Express and API Development**: Strengthened my understanding of RESTful APIs using Express.js, incorporating middleware for logging and error-handling.
  
- **MERN Stack**: Gained experience in full-stack development by integrating MongoDB, Express.js, React, and Node.js. This project is an excellent showcase of frontend-backend data flow and state management.
  
- **Linear Algebra Applications**: Applied cosine similarity to develop an advanced recommendation algorithm based on vectorized attributes.

- **Project Management**: Navigated the complexities of building a nuanced feature set while keeping an eye on performance, usability, and code quality. 


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

