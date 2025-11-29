"use client"

import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Center, Html, useProgress, PresentationControls } from '@react-three/drei'
import type { Model3DSettings } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import * as THREE from 'three'

interface Model3DViewerProps {
  settings: Model3DSettings
  className?: string
  showControls?: boolean
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2" />
        <p className="text-sm text-gray-600">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

interface ModelProps {
  url: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(url)

  // Clone the scene to avoid issues with reusing the same geometry
  const clonedScene = scene.clone()

  return (
    <Center>
      <primitive
        object={clonedScene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </Center>
  )
}

function FallbackBox() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

export function Model3DViewer({ settings, className = '', showControls = true }: Model3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    file,
    scale = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    autoRotate = true,
    autoRotateSpeed = 2,
    cameraPosition = [3, 3, 3],
    environmentPreset = 'studio',
    backgroundColor = '#f5f5f5',
    enableZoom = true,
    enablePan = true,
    minDistance = 1,
    maxDistance = 20,
  } = settings

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] rounded-lg overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {file ? (
            <Model
              url={file}
              scale={scale}
              position={position}
              rotation={rotation}
            />
          ) : (
            <FallbackBox />
          )}

          <Environment preset={environmentPreset} />

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableZoom={enableZoom}
            enablePan={enablePan}
            minDistance={minDistance}
            maxDistance={maxDistance}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {showControls && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-white/80 hover:bg-white"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}

// Preload function for optimization
export function preloadModel(url: string) {
  useGLTF.preload(url)
}

export default Model3DViewer
