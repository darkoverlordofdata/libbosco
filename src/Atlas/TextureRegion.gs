[indent=4]
/**
 * TextureRegion.gs
 *
 * Copyright 2016 Dark Overlord of Data
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the he MIT License (MIT).
 *
 * Author: 
 *      bruce davidson
 */
uses Gee

namespace Bosco

    class TextureRegion : Object
        prop texture: Texture
        prop top: int
        prop left: int
        prop width: int
        prop height: int
        u: double
        v: double
        u2: double
        v2: double
        regionWidth: int
        regionHeight: int

        construct(texture: Texture, x: int, y: int, width: int, height: int)
            _texture = texture
            _top = x
            _left = y
            _width = width
            _height = height 
            setRegion(x, y, width, height)

        def setRegion(x: int, y: int, width: int, height: int)
            pass

        def flip(x: bool, y:bool)
            pass
