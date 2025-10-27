'use client'

import { Application, extend, useTick } from '@pixi/react'
import {
	Assets,
	Container,
	Sprite,
	Text,
	TextStyle,
	type Texture,
	type Ticker,
} from 'pixi.js'
import { useEffect, useState } from 'react'

extend({ Sprite, Container, Text })

declare global {
	namespace JSX {
		interface IntrinsicElements {
			pixiSprite: any
			pixiContainer: any
			pixiText: any
		}
	}
}

const Bunny = () => {
	const [x, setX] = useState(window.innerWidth / 2)
	const [y, setY] = useState(window.innerHeight / 2)
	const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
	const [bunnyTexture, setBunnyTexture] = useState<Texture | null>(null)
	const speed = 5

	useEffect(() => {
		Assets.load('/bunny.png').then(setBunnyTexture)

		const handleKeyDown = (e: KeyboardEvent) => {
			setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }))
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }))
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	useTick((ticker: Ticker) => {
		const delta = ticker.deltaTime
		if (keys['ArrowUp']) {
			setY((y) => y - speed * delta)
		}
		if (keys['ArrowDown']) {
			setY((y) => y + speed * delta)
		}
		if (keys['ArrowLeft']) {
			setX((x) => x - speed * delta)
		}
		if (keys['ArrowRight']) {
			setX((x) => x + speed * delta)
		}
	})

	if (!bunnyTexture) {
		return null
	}

	return <pixiSprite anchor={0.5} texture={bunnyTexture} x={x} y={y} />
}

export default function Game() {
	const [backgroundTexture, setBackgroundTexture] = useState<Texture | null>(
		null,
	)
	const [isGameStarted, setIsGameStarted] = useState(false)
	const [showText, setShowText] = useState(true)

	useEffect(() => {
		Assets.load('/stage1bg.png').then(setBackgroundTexture)
	}, [])

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowText(false)
		}, 3000)
		return () => clearTimeout(timer)
	}, [])

	if (!isGameStarted) {
		return (
			<div className="flex h-screen items-center justify-center">
				<button
					className="rounded-md bg-blue-500 px-4 py-2 text-white"
					onClick={() => setIsGameStarted(true)}
					type="button"
				>
					Start Game
				</button>
			</div>
		)
	}

	if (!backgroundTexture) {
		return null
	}

	return (
		<Application backgroundColor={0x1099bb} resizeTo={window}>
			<pixiContainer>
				{/* Add the background image */}
				<pixiSprite
					anchor={{ x: 0, y: 0 }}
					height={window.innerHeight}
					texture={backgroundTexture}
					width={window.innerWidth}
					x={0}
					y={0}
				/>

				{/* Add a new container for the text with a higher zIndex */}
				<pixiContainer zIndex={1}>
					{showText && (
						<pixiText
							anchor={{ x: 0.5, y: 0.5 }}
							style={
								new TextStyle({
									align: 'center',
									fontSize: 60,
									fontWeight: 'bold',
									fill: '#ffffff',
								})
							}
							text="Welcome"
							x={window.innerWidth / 2}
							y={window.innerHeight / 2}
						/>
					)}
				</pixiContainer>
				<Bunny />
			</pixiContainer>
		</Application>
	)
}
