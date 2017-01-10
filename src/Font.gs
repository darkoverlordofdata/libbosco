/**
 * Sound.gs
 *
 * Wrapper for Mix_Chunk.WAV sound effect
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
uses SDLTTF
uses GLib

namespace Bosco

    class Font : Object

        innerFont : SDLTTF.Font

        def render(text : string, color : Video.Color) : Video.Surface
            return innerFont.render(text, color)
            
        def static fromFile(path: string, size: int) : Font

            var fx = new Font()

            if path.index_of("resource:///") == 0
                try
                    var ptr  = GLib.resources_lookup_data(path.substring(11), 0)
                    var rw = new RWops.from_mem((void*)ptr.get_data(), (int)ptr.get_size())
                    fx.innerFont = new SDLTTF.Font.RW(rw, 0, size)
                except e: Error
                    print "Error loading resource: %s\n", e.message

            else
                fx.innerFont = new SDLTTF.Font(path, size)

                // print "Path %s", path

                // var rw = new RWops.from_file(path, "rb")
                // if rw == null
                //     print "RW is null"
                // fx.innerFont = new SDLTTF.Font.RW(rw, 0, size)
                // if fx.innerFont == null
                //     print "error loading font %s", SDL.get_error()
                //     fx.innerFont = new SDLTTF.Font(path, size)

            return fx

