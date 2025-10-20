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

	useEffect(() => {
		Assets.load('/background.png').then(setBackgroundTexture)
	}, [])

	if (!backgroundTexture) {
		return null
	}

	return (
		<Application backgroundColor={0x1099bb} resizeTo={window}>
			<pixiSprite
				height={window.innerHeight}
				texture={backgroundTexture}
				width={window.innerWidth}
			/>
			<Bunny />
		</Application>
	)
}
