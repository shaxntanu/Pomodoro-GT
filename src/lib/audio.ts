type SoundType = 'bell' | 'chime' | 'ding' | 'beep' | 'tick' | 'countdown'

const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
  bell: { frequency: 800, duration: 1, type: 'sine' },
  chime: { frequency: 600, duration: 0.8, type: 'triangle' },
  ding: { frequency: 1000, duration: 0.6, type: 'sine' },
  beep: { frequency: 400, duration: 0.3, type: 'square' },
  tick: { frequency: 1200, duration: 0.05, type: 'square' },
  countdown: { frequency: 600, duration: 0.1, type: 'sine' },
}

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

export function playSound(soundType: SoundType, volume: number = 0.5): void {
  if (soundType === 'none' as string) return
  
  try {
    const ctx = getAudioContext()
    const config = soundConfigs[soundType]
    
    if (!config) return
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)
    
    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + config.duration)
  } catch (error) {
    console.warn('Audio playback failed:', error)
  }
}

export function playNotificationSound(soundType: string, volume: number): void {
  if (soundType !== 'none') {
    playSound(soundType as SoundType, volume)
  }
}

export function playCountdownBeep(volume: number): void {
  playSound('countdown', volume)
}

export function playTickSound(volume: number): void {
  playSound('tick', volume * 0.3)
}
