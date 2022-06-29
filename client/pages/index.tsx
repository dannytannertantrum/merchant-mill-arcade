import { css } from 'goober'
import { Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'

import { AllGamesData } from '../../common/games.types'
import { DEFAULT_MARQUEE } from '../utils/constants'
import { getGames } from '../api/games.apis'
import * as styles from '../sharedStyles'


interface Props {
	allGames: AllGamesData
}

const AllGamesPage: NextPage<Props> = ({ allGames }) => {
	const displayNav = (
		allGames && allGames.length > 0
			? (
				<nav>
					<h2>Select a game</h2>
					<Link href='/add-game'>+ Add a game</Link>
				</nav>
			) : <nav className={css`justify-content: flex-end; padding-bottom: 14px;`}><Link href='/add-game'>+ Add a game</Link></nav>
	)

	const gameList = (
		allGames?.map(game => (
			<li key={game.id}>
				<a href={`/games/${game.slug}`} className={styles.gameGridMarqueeLink}>
					<Fragment>
						{game.imageUrl
							? <span className={styles.marquee(game.imageUrl)}></span>
							: <span className={styles.marquee(DEFAULT_MARQUEE)}></span>
						}
						<span className={styles.gameTitle}>{game.title}</span>
					</Fragment>
				</a>
			</li>
		))
	)

	return (
		<Fragment>
			<Head>
				<title>All Games | Merchant Mill Arcade</title>
			</Head>
			{displayNav}
			{allGames && allGames.length > 0
				? <ul className={styles.gameGrid}>{gameList}</ul>
				: <h2>No games? May I suggest adding your pal, Peter Peppers to start?</h2>
			}
		</Fragment>
	)
}

export async function getStaticProps() {
	const response = await getGames()

	if (!response.isSuccess) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			allGames: response.data
		}
	}
}

export default AllGamesPage
