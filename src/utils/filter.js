export default function applyFilters(pokemons, query) {
  return pokemons.filter((pokemon) => {
    let matches = true;

    if (query) {
      let containsQuery = false;

      if (pokemon.name.toLowerCase().includes(query.toLowerCase())) {
        containsQuery = true;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
}
