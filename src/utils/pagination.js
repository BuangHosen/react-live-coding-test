export default function applyPagination(pokemons, page, limit) {
  return pokemons.slice(page * limit, page * limit + limit);
}
