Fun-a-day 2017
==============

I've been meaning to do this [fun-a-day](http://www.artclash.com/) project for
a few years. I originally called it "sim-a-day", but I imagine some of these
won't strictly be simulations. They may be visualizations or some other kind of
digital representation of some real phenomenon.

With luck, I'll see you at [Fun-A-Day Philadelphia](https://www.facebook.com/FunaDay/)!

01. [Bouncing Ball](01-bouncing-ball/)

    Simple ball bouncing on the ground.

02. [Celestial Bodies](02-celestial-bodies/)

    Two planets orbiting each other. Because there is no constant gravitational
    direction, and each step assumes that there is (see sim #3), the planets'
    orbits get steadily larger.

03. [Inner Solar System](03-inner-solar-system/)

    The four inner planets and the sun. Also, the moon. Scale is hard on this
    one. Given the distance from the Sun to Mars, the largest of the inner
    planets (Earth) would be waaaay smaller than a pixel. The Sun itself would
    be like 1 pixel. The sim would basically look like an empty screen. That
    would not be very interesting to look at.

    Also, it normally takes a long time for planets to circle the sun. We don't
    want to wait a year for simulated planets to make a revolution (also
    wouldn't be very interesting), so I sped things up. A simulation step
    corresponds to an hour in real life. While this is much shorter than a year,
    it's a long time between calculating mutual forces between bodies (I assume
    constant force between simulation steps). As a result, while the model is
    reasonable for a short time, it's fidelity degrades before long. Run it long
    enough and you'll see the Earth lose its moon.

04. [Superball!](04-superball/)

    Perfect elasticity. No matter what happens, the total energy of the ball is
    constant and is equal to the sum of its potential and kinetic energies.
