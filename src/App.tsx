import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExtendedPokemon, getAll, getByName, Pokemon } from './API';

import './styles.css';

const calculatePower = (pokemon: Pokemon) =>
	pokemon.hp +
	pokemon.attack +
	pokemon.defense +
	pokemon.special_attack +
	pokemon.special_defense +
	pokemon.speed;

const PokemonTable: React.FunctionComponent<{
	pokemon: ExtendedPokemon[];
}> = ({ pokemon }) => {
	return (
		<table>
			<thead>
				<tr>
					<td>ID</td>
					<td>Name</td>
					<td>Type</td>
					<td colSpan={6}>Stats</td>
					<td>Power</td>
				</tr>
			</thead>
			<tbody>
				{pokemon.map((p) => (
					<tr key={p.id}>
						<td>{p.id}</td>
						<td>{p.name}</td>
						<td>{p.type.join(',')}</td>
						<td>{p.hp}</td>
						<td>{p.attack}</td>
						<td>{p.defense}</td>
						<td>{p.special_attack}</td>
						<td>{p.special_defense}</td>
						<td>{p.speed}</td>
						<td>{p.power}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default function App() {
	const [pokemon, setPokemon] = useState<Pokemon[]>([]);
	const [threshold, setThreshold] = useState<number>(0);
	const [search, setSearch] = useState<string>('');

	useEffect(() => {
		getAll().then(setPokemon);
	}, []);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) =>
			setThreshold(parseInt(event.target.value, 10)),
		[]
	);

	const pokemonWithPower = useMemo(
		() =>
			pokemon.map((poke) => ({
				...poke,
				power: calculatePower(poke),
			})),
		[pokemon]
	);
	const handleSearch = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[]
	);
	const searchedPokemon = useMemo(
		() =>
			pokemonWithPower.filter(({ name }) =>
				name.match(new RegExp(search, 'i'))
			),
		[pokemonWithPower, search]
	);
	const filteredByThreshold = useMemo(
		() => searchedPokemon.filter((poke) => poke.power > threshold).length,
		[searchedPokemon, threshold]
	);

	const min = useMemo(
		() => Math.min(...searchedPokemon.map(({ power }) => power)),
		[searchedPokemon]
	);

	const max = useMemo(
		() => Math.max(...searchedPokemon.map(({ power }) => power)),
		[searchedPokemon]
	);

	return (
		<div>
			<div className='top-bar'>
				<div>Search</div>
				<input type='text' onChange={handleSearch} value={search}></input>
				<div>Power threshold</div>
				<input
					min={0}
					type='number'
					value={threshold}
					onChange={handleChange}></input>
				<div>Count over threshold: {filteredByThreshold}</div>
			</div>
			<div className='two-column'>
				<PokemonTable pokemon={searchedPokemon} />
				<div>
					<div>Min: {min < Infinity ? min : 0}</div>
					<div>Max: {max > -Infinity ? max : 0}</div>
				</div>
			</div>
		</div>
	);
}
