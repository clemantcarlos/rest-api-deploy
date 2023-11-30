import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '0811',
  database: 'moviesdb',
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  // GETTING ALL THE MOVIES
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        `SELECT id,name FROM genre WHERE LOWER(name)=?;`,
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      const [{ id }] = genres

      const [movies] = await connection.query(
        `SELECT  title,year,director,duration,poster,rate,BIN_TO_UUID(id) as id
        FROM movie
        JOIN movie_genres
        ON movie.id=movie_genres.movie_id
        WHERE  movie_genres.genre_id=?;`,
        [id]
      )
      return movies;
    }

    const [movies] = await connection.query(
      'SELECT title,year,director,duration,poster,rate,BIN_TO_UUID(id) as id FROM movie;'
    )
    return movies
  }
  // GET MOVIE BY ID
  static async getById({ id }) {
    const [movie] = await connection.query(
      `SELECT title,year,director,duration,poster,rate,BIN_TO_UUID(id) as id FROM movie
      WHERE id=UUID_TO_BIN(?);`,
      [id]
    )

    if (movie.length === 0) return null;

    return movie[0];
  }

  static async create({ input }) {
    const {
      title,
      year,
      director,
      duration,
      rate,
      poster
    } = input;

    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO movie (id,title,year,director,duration,poster,rate)
          VALUES (UUID_TO_BIN('${uuid}'),?,?,?,?,?,?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (error) {
      throw new Error('Error creating movie')
    }
    const [movie] = await connection.query(
      `SELECT title,year,director,duration,poster,rate,BIN_TO_UUID(id) as id FROM movie
      WHERE id=UUID_TO_BIN(?);`,
      [uuid]
    )
    return movie[0]
  }

  static async delete({ id }) {
    try {
      await connection.query(
        `DELETE FROM movie
        WHERE id=UUID_TO_BIN(?);`,
        [id]
      )
    } catch (error) {
      throw new Error('Error deleting movie')
    }
    return true
  }
  static async update({ id, input }) {
    // const {
    //   title,
    //   year,
    //   director,
    //   duration,
    //   rate,
    //   poster
    // } = input;

    // try {
    //   await connection.query(
    //     `UPDATE movie
    //     SET title=?,
    //     SET year=?,
    //     SET director=?,
    //     SET duration=?,
    //     SET rate=?,
    //     SET poster=?,
    //     WHERE id=UUID_TO_BIN(?);`,
    //     [title, year, director, duration, rate, poster, id]
    //   )
    // } catch (error) {
    //   throw new Error('Error deleting movie')
    // }

    // return true;
  }
}