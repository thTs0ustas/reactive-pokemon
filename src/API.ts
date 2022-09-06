export interface Pokemon {
	id: number;
	name: string;
	type: string[];
	hp: number;
	attack: number;
	defense: number;
	special_attack: number;
	special_defense: number;
	speed: number;
}
export interface ExtendedPokemon extends Pokemon {
	power: number;
}
export async function getAll(): Promise<ExtendedPokemon[]> {
	return fetch('/pokemon.json').then((resp) => resp.json());
}

export async function getByName(search: string): Promise<Pokemon[]> {
	const lcSearch = search.toLowerCase();
	return fetch('/pokemon.json')
		.then((resp) => resp.json())
		.then((pokemon: Pokemon[]) => pokemon.filter(({ name }) => name.toLowerCase().includes(lcSearch)));
}
