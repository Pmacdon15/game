'use client'

import { Application, extend, useTick } from '@pixi/react'
import { Assets, Container, Sprite, type Texture, type Ticker } from 'pixi.js'
import { useEffect, useState } from 'react'

extend({ Sprite, Container })

declare global {
	namespace JSX {
		interface IntrinsicElements {
			pixiSprite: any
			pixiContainer: any
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
	const [bgDimensions, setBgDimensions] = useState({ width: 0, height: 0 })

	useEffect(() => {
		Assets.load('/stage1bg.png').then(setBackgroundTexture)
	}, [])

	useEffect(() => {
		const updateSize = () => {
			if (backgroundTexture) {
				const textureRatio =
					backgroundTexture.width / backgroundTexture.height
				let width = window.innerHeight * textureRatio
				let height = window.innerHeight

				// Ensure no empty sides
				if (width < window.innerWidth) {
					width = window.innerWidth
					height = width / textureRatio
				}

				setBgDimensions({ width, height })
			}
		}

		updateSize()
		window.addEventListener('resize', updateSize)
		return () => window.removeEventListener('resize', updateSize)
	}, [backgroundTexture])

	const handleStartGame = () => {
		setIsGameStarted(true)
		// document.documentElement.requestFullscreen()
	}

	if (!isGameStarted) {
		return (
			<div className="flex h-screen items-center justify-center">
				<button
					className="rounded-md bg-blue-500 px-4 py-2 text-white"
					onClick={handleStartGame}
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
			{backgroundTexture && (
				<pixiSprite
					anchor={0.5}
					height={bgDimensions.height}
					texture={backgroundTexture}
					width={bgDimensions.width}
					x={window.innerWidth / 2}
					y={window.innerHeight / 2}
				/>
			)}
			<Bunny />
		</Application>
	)
}
