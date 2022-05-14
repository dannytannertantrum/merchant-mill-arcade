import { Fragment } from 'react'

import { gridItemGame } from './HomePageGoober'
import './HomePage.css'


const fakeData = [
    { id: 1, title: 'Frogger', imageUrl: 'https://arcademarquee.com/wp-content/uploads/2015/02/frogger_marquee_24x6_dedicated.jpg' },
    { id: 2, title: 'Burger Time', imageUrl: 'https://www.thisoldgamearchive.com/sc_images/products/BurgerTimeMqD-sca1-1000.jpg' },
    { id: 3, title: 'Attack From Mars', imageUrl: 'https://classicplayfields.com/wp-content/uploads/2019/02/AFM-Backglass.jpg' },
    { id: 4, title: 'Space Invaders', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/space-invaders_marquee.jpg' },
    { id: 5, title: 'Centipede', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/centipede_marquee-scaled.jpg' },
    { id: 6, title: 'Ms. Pac Man', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/ms-pacman_marquee_23x9-scaled.jpg' },
]

const HomePage = () => {
    return (
        <Fragment>
            <nav>
                <h2>Select a game</h2>
                <a href='/add-game'>+ Add a game</a>
            </nav>
            <hr />
            <ul>
                {fakeData.map(game => (
                    <li key={game.id}>
                        <a href='/' className={gridItemGame(game.imageUrl)}>
                            <h3>{game.title}</h3>
                        </a>
                    </li>
                ))}
            </ul>
        </Fragment>
    )
}

export default HomePage
