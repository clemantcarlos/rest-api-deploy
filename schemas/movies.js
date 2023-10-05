const z = require('zod')
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required',
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),//.endsWith('.jpg'),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Crime', 'Sci-Fi'],
      {
        required_error: 'Movie genre is rquired.',
        invalid_type_error: 'Movie genre must be an array of enums Genre'
      })
  )
})

function validateMovie(input) {
  return movieSchema.safeParse(input)
}

function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}