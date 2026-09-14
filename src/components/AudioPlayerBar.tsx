import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles,
  Radio,
  ExternalLink
} from 'lucide-react';
import { PodcastEpisode } from '../types';
import { formatTime } from '../utils/formatters';
import { soundEngine } from '../utils/audioPlayer';

interface AudioPlayerBarProps {
  podcast: PodcastEpisode | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onNavigateToPodcasts: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  podcast,
  isPlaying,
  onTogglePlay,
  onClose,
  onNavigateToPodcasts
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast ? podcast.durationSeconds : 120);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    if (!podcast) return;
    setCurrentTime(0);
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [podcast?.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts auto-play or stream fails, trigger playful relaxing synth
          setAudioError(true);
          soundEngine.startSyntheticLullaby((sec) => {
            setCurrentTime((prev) => (prev + 1) % (duration || 300));
          });
        });
      }
    } else {
      audioRef.current.pause();
      soundEngine.stop();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  if (!podcast) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    setCurrentTime(target);
    if (audioRef.current && !audioError) {
      audioRef.current.currentTime = target;
    }
  };

  const handleSkip = (seconds: number) => {
    const nextTime = Math.max(0, Math.min(currentTime + seconds, duration));
    setCurrentTime(nextTime);
    if (audioRef.current && !audioError) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSpeedToggle = () => {
    const rates = [1, 1.25, 1.5];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside aria-label="پخش‌کننده صوتی پادکست" className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-amber-200 dark:border-slate-800 shadow-2xl px-4 py-3 sm:px-6 transition-all duration-300">
      <audio
        ref={audioRef}
        src={podcast.audioUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          onTogglePlay();
          setCurrentTime(0);
        }}
        onError={() => {
          setAudioError(true);
          if (isPlaying) {
            soundEngine.startSyntheticLullaby((sec) => {
              setCurrentTime((prev) => (prev + 1) % (duration || 300));
            });
          }
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track info & Cover */}
        <div className="flex items-center gap-3 w-full md:w-1/3 justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src={podcast.coverImage}
                alt={podcast.title}
                className="w-12 h-12 rounded-xl object-cover shadow-xs border border-amber-200"
                referrerPolicy="no-referrer"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <span className="flex gap-0.5 items-end h-4">
                    <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-2"></span>
                    <span className="w-1 bg-white animate-[bounce_1.1s_infinite] h-4"></span>
                    <span className="w-1 bg-white animate-[bounce_0.9s_infinite] h-3"></span>
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{podcast.title}</h4>
                {audioError && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-medium flex items-center gap-0.5">
                    <Radio className="w-2.5 h-2.5" />
                    استودیو زنده
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700">
                گوینده: {podcast.narrator} • <span className="text-amber-700 font-medium">{podcast.categoryName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToPodcasts}
            className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 p-1 hover:bg-amber-50 rounded md:hidden"
            title="رفتن به صفحه پادکست‌ها"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Controls & Progress Bar */}
        <div className="w-full md:w-1/2 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            {/* Speed toggle */}
            <button
              id="audio-speed-btn"
              onClick={handleSpeedToggle}
              className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="تغییر سرعت پخش"
            >
              {playbackRate}x
            </button>

            {/* Back 10 sec */}
            <button
              id="audio-skip-back-btn"
              onClick={() => handleSkip(-10)}
              className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
              title="۱۰ ثانیه قبل"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              id="audio-play-pause-btn"
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
              aria-label={isPlaying ? 'توقف' : 'پخش'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
            </button>

            {/* Forward 10 sec */}
            <button
              id="audio-skip-forward-btn"
              onClick={() => handleSkip(10)}
              className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
              title="۱۰ ثانیه بعد"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Navigate to full podcasts */}
            <button
              id="audio-view-all-podcasts-btn"
              onClick={onNavigateToPodcasts}
              className="hidden md:flex items-center gap-1 text-xs text-slate-700 hover:text-orange-600 transition-colors p-1"
              title="آرشیو پادکست‌ها"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>همه قصه‌ها</span>
            </button>
          </div>

          {/* Timeline and Seek Bar */}
          <div className="w-full flex items-center gap-2 text-xs text-slate-700 font-mono">
            <span className="w-10 text-left">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                id="audio-seek-slider"
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div 
                className="absolute left-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg pointer-events-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="w-10 text-right">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Close */}
        <div className="hidden md:flex items-center gap-3 w-1/4 justify-end">
          <div className="flex items-center gap-2">
            <button
              id="audio-mute-toggle-btn"
              onClick={toggleMute}
              className="text-slate-600 hover:text-slate-800 p-1"
              title={isMuted ? 'صدادار' : 'بی‌صدا'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              id="audio-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setVolume(newVol);
                setIsMuted(newVol === 0);
                if (audioRef.current) {
                  audioRef.current.volume = newVol;
                }
              }}
              className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
          </div>

          <button
            id="audio-close-bar-btn"
            onClick={() => {
              soundEngine.stop();
              onClose();
            }}
            className="p-1.5 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            title="بستن پلیر"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
