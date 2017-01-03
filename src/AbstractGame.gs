/**
 * AbstractGame.gs
 *
 * Copyright 2016 Dark Overlord of Data
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the he MIT License (MIT).
 *
 * Author: 
 *      bruce davidson
 */
[indent=4]
uses SDL
uses SDLMixer    
uses SDL.Input
uses SDL.Video
uses SDLTTF

namespace Bosco



    class AbstractGame : Object

        name : string
        width : int
        height : int
        defaultFont: string
        running : bool
        window : Window
        renderer : Renderer
        sprites : GenericArray of Sprite
        onetime : list of Sprite = new list of Sprite
        keys : array of uint8 = new array of uint8[255]
        
        prop readonly delta : double

        showFps : bool = false
        _fpsFont: Bosco.Font
        _fpsSprite : Sprite
        _currentTime: double = 0.0
        _lastTime: double = 0.0
        _currentFps: double = 0.0
        _elapsed: double = 0.0
        _frames: int = 0

        _t1: double = 0.0
        _t2: double = 0.0
        _t3: double = 0.0

        construct() // initialize bosco
            new Bosco.Color()


        def Run() : int


            if Initialize() == false
                return -1

            e : Event
            _currentTime = (double)GLib.get_real_time()/1000000.0 
            while running
                while Event.poll(out e) != 0
                    case e.type // patch for keyboardGetState
                        when  SDL.EventType.KEYDOWN
                            keys[e.key.keysym.sym] = 1
                        when  SDL.EventType.KEYUP
                            keys[e.key.keysym.sym] = 0

                    Events(e)


                _lastTime = _currentTime
                _currentTime = (double)GLib.get_real_time()/1000000.0
                _delta = (_currentTime - _lastTime)

                _t1 = (double)GLib.get_real_time()/1000000.0 

                Update(_delta)
                _t2 = (double)GLib.get_real_time()/1000000.0 
                GLib.Thread.usleep(1000)
                Draw(_delta)
                _t3 = (double)GLib.get_real_time()/1000000.0 

                
                if showFps
                    _frames++
                    _elapsed = _elapsed + _delta

                    if _elapsed > 1.0
                        _currentFps = (double)_frames / _elapsed
                        _elapsed = 0.0
                        _frames = 0

                    if _fpsSprite != null do _fpsSprite = null
                    _fpsSprite = Sprite.fromRenderedText(renderer, _fpsFont, "%2.2f".printf(_currentFps), {250, 250, 250})
                    _fpsSprite.centered = false

                //stdout.printf("%f\n", (_t2-_t1))

            Dispose()
            return 0

        def virtual Events(e: Event)
            pass

        def virtual Update(delta: double)
            pass

        def virtual Draw(delta: double)
            renderer.set_draw_color(0x0, 0x0, 0x0, 0x0)
            renderer.clear()

            for var i=0 to (sprites.length-1)
                var sprite = sprites[i]
                sprite.render(renderer, sprite.x, sprite.y)

            if showFps do _fpsSprite.render(renderer, 0, 0)

            for var sprite in onetime  
                sprite.render(renderer, sprite.x, sprite.y)
                
            onetime = new list of Sprite           
            renderer.present()

        def virtual Dispose()
            pass

        /**
         * Initialize SDL
         */
        def virtual Initialize() : bool

            if SDL.init(SDL.InitFlag.VIDEO) < 0
                print "SDL could not initialize! SDL Error: %s", SDL.get_error()
                return false

            if SDLImage.init(SDLImage.InitFlags.PNG) < 0
                print "SDL_image could not initialize! SDL Error: %s", SDL.get_error()
                return false

            if !SDL.Hint.set_hint(Hint.RENDER_SCALE_QUALITY, "1")
                print "Warning: Linear texture filtering not enabled!! SDL Error: %s", SDL.get_error()

            window = new Window(name, Window.POS_CENTERED, Window.POS_CENTERED, width, height, WindowFlags.SHOWN)
            if window == null
                print "Window could not be created! SDL Error: %s", SDL.get_error()
                return false

            renderer = Renderer.create(window, -1, RendererFlags.ACCELERATED | RendererFlags.PRESENTVSYNC)
            if renderer == null
                print "Renderer could not be created! SDL Error: %s", SDL.get_error()
                return false

            renderer.set_draw_color(0xFF, 0xFF, 0xFF, 0)

            if SDLTTF.init() == -1
                print "SDL_ttf could not initialize! SDL Error: %s", SDL.get_error()
                return false

            if defaultFont != ""
                _fpsFont = Bosco.Font.fromFile(defaultFont, 16)
                if _fpsFont == null
                    showFps = false
                    print "Failed to load font, showFps set to false. SDL Error: %s", SDL.get_error()
                else
                    showFps = true

            
            /**
             * TODO: calculate best values for mixer.open
             */
            if SDLMixer.open(22050, Audio.AudioFormat.S16LSB, 2, 4096) == -1
                print "SDL_mixer unagle to initialize! SDL Error: %s", SDL.get_error()

            return true

