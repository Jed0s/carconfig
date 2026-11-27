"""Generates data/challenger-3.6.json. Run: python3 data/scripts/gen_challenger.py data/challenger-3.6.json"""
import json, sys, copy

F = {}
def feat(fid, name, cat, hint):
    F[fid] = {"name": name, "category": cat, "hint": hint}

# ---------- feature glossary ----------
feat("v6-pentastar", "3.6L Pentastar V6", "performance", "The 6-cylinder engine in every SXT and GT: about 303-305 hp. Cheaper to run and insure than the V8 R/T, but noticeably slower.")
feat("auto-8-speed", "8-speed automatic (TorqueFlite)", "performance", "The only transmission offered with the V6. More gears keep the engine in its efficient range, so it is smooth and reasonably economical. No manual was offered on V6 cars.")
feat("awd", "All-wheel drive", "performance", "Sends power to the front wheels too when the rear ones slip. Big help in rain and snow. The Challenger's system drives the rear wheels normally and disconnects the front axle to save fuel until it is needed.")
feat("backup-camera", "Rear backup camera (ParkView)", "safety", "Shows what is behind the car on the screen when you shift into reverse, with guide lines.")
feat("parksense-rear", "Rear park assist (ParkSense)", "safety", "Sensors in the rear bumper beep faster as you get close to an object while reversing. Different from the camera: it warns you by sound even if you are not looking at the screen.")
feat("blind-spot", "Blind-spot monitoring", "safety", "A light in the side mirror turns on when a car is in the spot you cannot see over your shoulder. Very useful on a Challenger because rear visibility is poor.")
feat("rear-cross-path", "Rear cross-path detection", "safety", "Warns you when backing out of a parking space if a car is coming from the side, which you often cannot see past neighbouring cars.")
feat("forward-collision-warning", "Forward collision warning", "safety", "Beeps and flashes if you are closing in on the car ahead too fast. On the Challenger it is a warning only: it does not brake the car for you (no automatic emergency braking).")
feat("adaptive-cruise", "Adaptive cruise control", "safety", "Cruise control that keeps a set distance from the car ahead, slowing down and speeding up with traffic. Great on highways.")
feat("auto-high-beams", "Automatic high beams", "safety", "Turns the high beams on in the dark and dips them automatically when a car is coming the other way.")
feat("rain-sensing-wipers", "Rain-sensing wipers", "comfort", "The wipers switch on and adjust their speed by themselves when it rains.")
feat("hid-headlamps", "HID (xenon) headlamps", "safety", "Brighter, whiter headlights than the standard halogen bulbs. Noticeably better at night.")
feat("fog-lamps", "Front fog lamps", "safety", "Low lights in the front bumper that light the road close to the car in fog or heavy rain.")
feat("remote-start", "Remote start", "comfort", "Start the engine from the key fob so the cabin is warm or cool before you get in.")
feat("keyless-go", "Keyless entry and push-button start (Keyless Enter 'n Go)", "comfort", "Keep the key in your pocket: touch the door handle to unlock and press a button to start.")
feat("power-folding-mirrors", "Power folding side mirrors", "comfort", "The side mirrors fold in at the press of a button, handy in tight garages or parking spots.")
feat("garage-door-opener", "Universal garage door opener", "comfort", "Buttons in the car you program to open your garage door or gate, so you do not need a separate remote.")
feat("dual-zone-climate", "Dual-zone automatic climate control", "comfort", "Driver and passenger set their own temperatures, and the system holds them automatically.")
feat("heated-seats", "Heated front seats", "comfort", "Warms the seat cushion and back in cold weather.")
feat("ventilated-seats", "Ventilated front seats", "comfort", "Fans blow air through small holes in the seats to keep you cool in hot weather. Usually only with leather seats.")
feat("heated-steering-wheel", "Heated steering wheel", "comfort", "Warms the steering wheel rim so you can drive without gloves in winter.")
feat("power-tilt-telescope", "Power tilt and telescoping steering column", "comfort", "Moves the steering wheel up, down, in and out with a switch to fit your driving position.")
feat("seat-memory", "Driver seat memory", "comfort", "Saves the driver seat (and often mirror) position so two drivers can switch with one button.")
feat("houndstooth-cloth", "Houndstooth cloth seats", "comfort", "Durable cloth seats with a retro checked pattern. Standard on the base cars.")
feat("nappa-leather", "Nappa leather seats", "comfort", "Soft, high-grade leather upholstery. Feels premium and is easier to clean than cloth.")
feat("nappa-alcantara", "Nappa leather and Alcantara performance seats", "comfort", "Sportier seats with bigger side bolsters that hold you in corners, trimmed in leather plus Alcantara (a grippy suede-like fabric).")
feat("uconnect-7", "Uconnect 7-inch touchscreen", "technology", "The standard infotainment screen for radio, phone and apps.")
feat("uconnect-84", "Uconnect 8.4-inch touchscreen", "technology", "The bigger, faster infotainment screen. Easier to read and unlocks extras like Dodge Performance Pages.")
feat("navigation", "Built-in navigation", "technology", "Maps stored in the car. Works without phone signal, but most people now use Apple CarPlay or Android Auto instead.")
feat("carplay-android", "Apple CarPlay and Android Auto", "technology", "Shows your phone's apps (maps, music, messages) on the car screen. Standard from 2017 with Uconnect 4.")
feat("siriusxm", "SiriusXM satellite radio", "technology", "Subscription radio with hundreds of channels that works nationwide. Usually comes with a free trial.")
feat("wifi-hotspot", "4G LTE Wi-Fi hotspot", "technology", "The car has its own mobile data connection and can share Wi-Fi with passengers (needs a data plan).")
feat("performance-pages", "Dodge Performance Pages", "performance", "Screens on the touchscreen showing g-forces, lap and 0-60 timers, gauges, plus settings for launch control and drive modes.")
feat("launch-control", "Launch control", "performance", "Holds engine revs and manages wheelspin so you get the quickest possible start from a standstill.")
feat("super-track-pak", "Super Track Pak", "performance", "Dodge's name for a sport mode setup: firmer steering and suspension feel, Performance Pages and a sport/track button. Standard on GT, optional on early SXTs.")
feat("tft-cluster-7", "7-inch digital driver display", "technology", "A screen between the gauges that shows trip info, tire pressure, navigation prompts and more.")
feat("alpine-6", "Alpine premium audio (6 speakers, 276 W)", "audio", "Upgraded speakers and amplifier. Clearer and louder than the base stereo.")
feat("alpine-9-sub", "Alpine audio with subwoofer (9 speakers, 506 W)", "audio", "Adds more speakers and a subwoofer for deep bass and surround sound.")
feat("harman-kardon", "Harman Kardon audio (18 speakers, 900 W)", "audio", "The top sound system: 18 speakers and a trunk subwoofer. Concert-like sound.")
feat("sunroof", "Power sunroof", "comfort", "A glass panel in the roof that tilts and slides open.")
feat("wheels-18", "18-inch alloy wheels", "appearance", "Standard size. Taller tire sidewalls give a softer ride and cheaper tires.")
feat("wheels-19", "19-inch alloy wheels", "appearance", "Bigger wheels than the base car: sharper look and a bit more grip, slightly firmer ride.")
feat("wheels-20", "20-inch alloy wheels", "appearance", "Large wheels with low-profile tires: aggressive look and better handling, but a firmer ride and pricier tires.")
feat("black-exterior", "Black exterior accents", "appearance", "Gloss or satin black grille, badges, spoiler and wheels for a darker, meaner look.")
feat("rear-spoiler", "Rear spoiler", "appearance", "A lip on the trunk lid. Mostly a style element at road speeds.")
feat("hood-scoop", "Functional hood scoop", "appearance", "An air intake in the hood. On the GT it is real and feeds cooler air to the engine, and it gives the V6 car a V8 look.")
feat("front-splitter", "Front splitter", "appearance", "A blade under the front bumper that cuts air at speed and makes the car look lower and sportier.")
feat("performance-suspension", "Performance suspension", "performance", "Firmer springs and shocks so the car leans less in corners. Slightly harsher over bumps.")
feat("performance-brakes", "Performance brakes", "performance", "Larger brake discs and calipers that stop better and resist fading when used hard.")
feat("brembo-brakes", "Brembo 4-piston brakes", "performance", "High-end brake calipers (usually painted red). Strong, consistent braking for spirited driving.")
feat("bilstein-shocks", "Bilstein performance shocks", "performance", "Premium shock absorbers that control the body better in corners without being too harsh.")
feat("axle-307", "3.07 rear axle ratio", "performance", "A shorter final drive gear than the base car. The car feels quicker off the line at the cost of slightly higher revs on the highway.")
feat("limited-slip", "Limited-slip differential", "performance", "Splits power between the rear wheels so the one with grip keeps pushing. Helps when accelerating out of corners and on slippery roads.")
feat("performance-steering", "Performance steering", "performance", "Quicker, weightier steering that feels more connected to the road.")
feat("performance-steering-wheel", "Performance steering wheel with paddle shifters", "performance", "A thicker, sportier wheel (flat-bottom on some packages) with paddles to change gears manually.")
feat("block-heater", "Engine block heater", "other", "Plugs into a wall outlet to keep the engine warm overnight in very cold climates so it starts easily.")
feat("compact-spare", "Compact spare tire", "other", "A small temporary spare wheel. Without it the car only has a tire inflator kit, which cannot fix a torn tire.")
feat("ambient-lighting", "Ambient interior lighting", "appearance", "Soft LED lighting around the cabin at night.")
feat("surround-camera", "360-degree surround-view camera", "safety", "Stitches several cameras into a bird's-eye view of the car for parking. Note: never offered on the Challenger, which only has a rear camera. Listed here because it appears on many other cars.")

# ---------- package builders ----------
def pkg(pid, name, on, features, price=None, conf="likely", notes=None, sources=None, requires=None, includes=None):
    p = {"id": pid, "name": name, "availableOn": on}
    if price is not None:
        p["priceUsd"] = price
    p["features"] = features
    if requires: p["requires"] = requires
    if includes: p["includes"] = includes
    p["confidence"] = conf
    if notes: p["notes"] = notes
    if sources: p["sources"] = sources
    return p

S = {
    "mi2019sxt": {"title": "MoparInsiders: 2019 Dodge Challenger SXT Pricing & Options List", "url": "https://moparinsiders.com/2019-dodge-challenger-sxt-pricing-options-list/"},
    "mi2019gt": {"title": "MoparInsiders: 2019 Dodge Challenger GT AWD Pricing & Options List", "url": "https://moparinsiders.com/2019-dodge-challenger-gt-awd-pricing-options-list/"},
    "mi2020sxt": {"title": "MoparInsiders: 2020 Dodge Challenger SXT Pricing & Options List", "url": "https://moparinsiders.com/2020-dodge-challenger-sxt-pricing-options-list/"},
    "fca2017gt": {"title": "FCA/Stellantis press release: 2017 Dodge Challenger GT (Dec 7, 2016)", "url": "https://www.media.stellantisnorthamerica.com/text.do?id=18033"},
    "carvana2017": {"title": "Carvana: 2017 Dodge Challenger overview", "url": "https://www.carvana.com/buy/2017-dodge-challenger/"},
    "cars2022": {"title": "Cars.com: Dodge Challenger, 2021 or 2022? (Jan 14, 2022)", "url": "https://www.cars.com/articles/dodge-challenger-which-should-you-buy-2021-or-2022-445858"},
    "at2023": {"title": "Autotrader: 2023 Dodge Challenger, choosing the right trim", "url": "https://www.autotrader.com/car-reviews/2023-dodge-challenger-choosing-the-right-trim"},
    "bpo2023": {"title": "BuildPriceOption: 2023 Dodge Challenger trim levels", "url": "https://www.buildpriceoption.com/2023-dodge-challenger-trim-levels-and-standard-features/"},
    "memory": {"title": "General knowledge, not checked against a primary source"},
}

DCG = ["blind-spot", "rear-cross-path", "hid-headlamps", "power-folding-mirrors"]
DCG_SXT_EXTRA = ["fog-lamps", "parksense-rear", "remote-start", "garage-door-opener"]
TECH = ["adaptive-cruise", "forward-collision-warning", "auto-high-beams", "rain-sensing-wipers"]
COLD = ["heated-seats", "heated-steering-wheel"]
PLUS_SXT = ["uconnect-84", "alpine-6", "nappa-leather", "heated-seats", "heated-steering-wheel", "power-tilt-telescope", "seat-memory", "siriusxm", "wifi-hotspot", "performance-pages", "parksense-rear", "garage-door-opener", "wheels-20", "performance-brakes"]
PLUS_GT = ["nappa-alcantara", "heated-seats", "ventilated-seats", "heated-steering-wheel", "power-tilt-telescope", "seat-memory", "alpine-6", "siriusxm", "wifi-hotspot", "garage-door-opener"]
BLACKTOP = ["black-exterior", "rear-spoiler", "fog-lamps"]

# ---------- trim standard features ----------
SXT_BASE = ["v6-pentastar", "auto-8-speed", "backup-camera", "keyless-go", "dual-zone-climate", "houndstooth-cloth", "wheels-18", "tft-cluster-7", "rear-spoiler"]
GT_2017 = ["v6-pentastar", "auto-8-speed", "awd", "backup-camera", "parksense-rear", "keyless-go", "dual-zone-climate", "fog-lamps", "rear-spoiler", "wheels-19", "nappa-leather", "heated-seats", "ventilated-seats", "heated-steering-wheel", "uconnect-84", "alpine-6", "tft-cluster-7", "super-track-pak", "performance-pages", "carplay-android"]
GT_2019 = ["v6-pentastar", "auto-8-speed", "backup-camera", "parksense-rear", "keyless-go", "remote-start", "dual-zone-climate", "fog-lamps", "hood-scoop", "front-splitter", "wheels-20", "houndstooth-cloth", "uconnect-84", "carplay-android", "tft-cluster-7", "super-track-pak", "performance-pages", "launch-control", "performance-suspension", "performance-brakes", "performance-steering", "axle-307", "performance-steering-wheel", "garage-door-opener"]

def sxt(year, msrp=None, conf="likely", extra=(), notes=None):
    t = {"id": "sxt", "name": "SXT", "standardFeatures": SXT_BASE + list(extra), "confidence": conf}
    if msrp: t["baseMsrpUsd"] = msrp
    if notes: t["notes"] = notes
    return t

def gt(std, msrp=None, conf="likely", notes=None):
    t = {"id": "gt", "name": "GT", "standardFeatures": std, "confidence": conf}
    if msrp: t["baseMsrpUsd"] = msrp
    if notes: t["notes"] = notes
    return t

years = []

# ---- 2015-2016: SXT only (SXT Plus was its own trim) ----
for y in (2015, 2016):
    years.append({
        "year": y,
        "notes": "First years of the facelifted Challenger with the 8-speed automatic. No GT yet: the V6 came as SXT or the better-equipped SXT Plus. Package names and contents for these years are from general knowledge and not yet checked against a window sticker.",
        "sources": [S["memory"]],
        "trims": [sxt(y, conf="likely", extra=["uconnect-7"], notes="Prices excluding destination were roughly $27k; not verified.")],
        "packages": [
            pkg("sxt-plus", "SXT Plus (upgrade trim)", ["sxt"], ["nappa-leather", "heated-seats", "heated-steering-wheel", "uconnect-84", "alpine-6", "wheels-20", "power-tilt-telescope"], conf="uncertain", notes="Sold as a separate trim level, modelled here as an upgrade over the SXT. Exact contents varied by year."),
            pkg("super-track-pak", "Super Track Pak", ["sxt"], ["super-track-pak", "performance-suspension", "performance-steering", "axle-307", "wheels-20", "performance-pages"], conf="uncertain", notes="Sport-oriented option for V6 cars in the early facelift years."),
            pkg("blacktop", "Blacktop Package", ["sxt"], BLACKTOP + ["wheels-20"], conf="uncertain"),
            pkg("driver-convenience-group", "Driver Convenience Group", ["sxt"], DCG + DCG_SXT_EXTRA, conf="uncertain"),
            pkg("technology-group", "Technology Group", ["sxt"], TECH, conf="uncertain", notes="Believed to require the SXT Plus."),
            pkg("navigation", "Navigation", ["sxt"], ["navigation", "uconnect-84"], conf="uncertain"),
            pkg("sunroof", "Power sunroof", ["sxt"], ["sunroof"], conf="uncertain"),
        ],
    })

# ---- 2017-2018: GT arrives (AWD only) ----
for y in (2017, 2018):
    v = "verified" if y == 2017 else "likely"
    years.append({
        "year": y,
        "notes": "The GT arrives for 2017 as an all-wheel-drive-only, well-equipped V6 model (the first AWD American muscle coupe). Uconnect 4 with Apple CarPlay and Android Auto becomes available. SXT Plus is still offered.",
        "sources": [S["fca2017gt"], S["carvana2017"], S["memory"]],
        "trims": [
            sxt(y, conf="likely", extra=["uconnect-7", "carplay-android"]),
            gt(GT_2017, msrp=33395 if y == 2017 else None, conf=v, notes="AWD only. Base price excludes the $1,095 destination charge (2017)." if y == 2017 else "AWD only. Price not verified."),
        ],
        "packages": [
            pkg("sxt-plus", "SXT Plus (upgrade trim)", ["sxt"], ["nappa-leather", "heated-seats", "heated-steering-wheel", "uconnect-84", "alpine-6", "wheels-20", "power-tilt-telescope", "performance-pages"], conf="likely", notes="Separate trim level in 2017 (confirmed by Carvana's 2017 trim list), modelled as an upgrade over the SXT."),
            pkg("gt-interior", "GT Interior Package", ["gt"], ["nappa-alcantara", "alpine-9-sub", "performance-steering-wheel"], price=995 if y == 2017 else None, conf=v, sources=[S["fca2017gt"]]),
            pkg("blacktop", "Blacktop Package", ["sxt", "gt"], BLACKTOP, conf="uncertain"),
            pkg("driver-convenience-group", "Driver Convenience Group", ["sxt", "gt"], DCG, conf="uncertain", notes="On the SXT it also adds rear park sensors, remote start, fog lamps and a garage door opener."),
            pkg("technology-group", "Technology Group", ["sxt", "gt"], TECH, conf="uncertain"),
            pkg("harman-kardon", "Harman Kardon Audio Group", ["gt"], ["harman-kardon"], conf="uncertain"),
            pkg("navigation", "Uconnect 4C NAV", ["sxt", "gt"], ["navigation", "uconnect-84"], conf="uncertain"),
            pkg("sunroof", "Power sunroof", ["sxt", "gt"], ["sunroof"], conf="uncertain"),
        ],
    })

# ---- 2019: verified option lists ----
def packages_2019_like(prices, conf, src, harman_on_sxt=False):
    p = prices
    return [
        pkg("plus", "Plus Package", ["sxt", "gt"], ["uconnect-84", "alpine-6", "nappa-leather", "nappa-alcantara", "heated-seats", "ventilated-seats", "heated-steering-wheel", "power-tilt-telescope", "siriusxm", "wifi-hotspot", "performance-pages", "parksense-rear", "garage-door-opener"], price=p.get("plus"), conf=conf, sources=src,
            notes="Replaced the SXT Plus trim. SXT gets Nappa leather sport seats; GT gets Nappa/Alcantara performance seats with ventilation. The SXT version also brings 20-inch wheels and performance brakes in some years."),
        pkg("technology-group", "Technology Group", ["sxt", "gt"], TECH, price=p.get("tech"), conf=conf, sources=src),
        pkg("driver-convenience-group", "Driver Convenience Group", ["sxt", "gt"], DCG, price=p.get("dcg"), conf=conf, sources=src,
            notes="On the SXT it also adds fog lamps, rear park sensors, remote start and a garage door opener (already standard on the GT)."),
        pkg("cold-weather-group", "Cold Weather Group", ["sxt", "gt"], COLD, price=p.get("cold"), conf=conf, sources=src,
            notes="Not available together with the Plus Package, which already includes these. Adds a 180-amp alternator."),
        pkg("blacktop", "Blacktop Package", ["sxt", "gt"], BLACKTOP + ["wheels-20"], price=p.get("blacktop"), conf=conf, sources=src,
            notes="Black-painted wheels (20-inch on SXT, 19-inch on GT AWD in 2019). Optional black stripe at no charge."),
        pkg("alpine-audio", "Alpine Audio Group with Subwoofer", ["sxt", "gt"], ["alpine-9-sub"], price=p.get("alpine"), conf=conf, sources=src),
        pkg("harman-kardon", "Harman Kardon Audio Group", ["gt"] + (["sxt"] if harman_on_sxt else []), ["harman-kardon"], price=p.get("hk"), conf=conf, sources=src),
        pkg("navigation", "Uconnect 4C NAV with 8.4-inch display", ["sxt", "gt"], ["navigation", "uconnect-84"], price=p.get("nav"), conf=conf, sources=src,
            notes="$795 instead of $1,095 when ordered with the Plus Package (2019-2020)." if p.get("nav") else None),
        pkg("sunroof", "Power sunroof", ["sxt", "gt"], ["sunroof"], price=p.get("sunroof"), conf=conf, sources=src),
        pkg("siriusxm", "SiriusXM satellite radio", ["sxt", "gt"], ["siriusxm"], price=p.get("sxm"), conf=conf, sources=src),
        pkg("interior-appearance", "Mopar Interior Appearance Package", ["sxt"], [], price=p.get("iap"), conf=conf, sources=src, notes="Cosmetic interior trim pieces from Mopar."),
        pkg("compact-spare", "Compact spare tire", ["sxt", "gt"], ["compact-spare"], price=p.get("spare"), conf=conf, sources=src),
        pkg("block-heater", "Engine block heater", ["sxt", "gt"], ["block-heater"], price=p.get("heater"), conf=conf, sources=src),
    ]

years.append({
    "year": 2019,
    "notes": "Big reshuffle: the SXT Plus trim is replaced by an optional Plus Package, and the GT is now offered with rear-wheel drive (sportier, with performance suspension and hood scoop) as well as AWD. Prices exclude the $1,395 destination charge.",
    "sources": [S["mi2019sxt"], S["mi2019gt"]],
    "trims": [
        sxt(2019, msrp=27295, conf="verified", extra=["uconnect-7", "carplay-android"]),
        gt(GT_2019, conf="likely", notes="GT AWD started at $32,995 (verified, MoparInsiders). The GT AWD has 19-inch wheels and lacks the RWD car's performance suspension and steering. GT RWD base price not verified."),
    ],
    "packages": packages_2019_like({
        "plus": {"sxt": 3000, "gt": 2495}, "tech": {"sxt": 1195, "gt": 1295}, "dcg": 1095, "cold": 495, "blacktop": 695,
        "alpine": 895, "hk": 1595, "nav": 1095, "sunroof": 1195, "sxm": 195, "iap": 475, "spare": {"sxt": 495, "gt": 295}, "heater": 95,
    }, "verified", [S["mi2019sxt"], S["mi2019gt"]]),
})

# ---- 2020: verified SXT prices ----
p2020 = packages_2019_like({
    "plus": {"sxt": 3195}, "tech": {"sxt": 1295}, "dcg": {"sxt": 1095}, "cold": {"sxt": 495}, "blacktop": {"sxt": 1295},
    "alpine": {"sxt": 995}, "nav": 1095, "sunroof": {"sxt": 1295}, "sxm": 195, "iap": 475, "spare": {"sxt": 495}, "heater": 95,
}, "likely", [S["mi2020sxt"]])
p2020.append(pkg("performance-handling-group", "Performance Handling Group", ["gt"], ["brembo-brakes", "bilstein-shocks", "wheels-20", "performance-steering-wheel", "limited-slip"], conf="likely", sources=[S["mi2020sxt"]], notes="RWD GT only. Price not found."))
p2020.append(pkg("awd", "All-wheel drive", ["sxt", "gt"], ["awd", "wheels-19"], conf="likely", notes="AWD becomes available on the SXT around this time (some sources say 2019). Price not verified for 2020."))
years.append({
    "year": 2020,
    "notes": "Carries over the 2019 layout. SXT package prices are verified from the 2020 SXT options list; GT prices are not. Prices exclude the $1,495 destination charge.",
    "sources": [S["mi2020sxt"]],
    "trims": [
        sxt(2020, msrp=27995, conf="verified", extra=["uconnect-7", "carplay-android"]),
        gt(GT_2019, conf="likely", notes="RWD or AWD. Base price not verified."),
    ],
    "packages": p2020,
})

# ---- 2021-2023 ----
def late_packages(conf, src, awd_price=None, year=None):
    ps = packages_2019_like({}, conf, src)
    ps = [p for p in ps if p["id"] not in ("interior-appearance",)]
    ps.append(pkg("interior-appearance", "Interior Appearance Group by Mopar", ["sxt", "gt"], [], conf="uncertain", sources=src))
    ps.append(pkg("performance-handling-group", "Performance Handling Group", ["gt"], ["brembo-brakes", "performance-suspension", "performance-steering", "limited-slip", "wheels-20"], conf=conf, sources=src, notes="RWD GT only."))
    ps.append(pkg("awd", "All-wheel drive", ["sxt", "gt"], ["awd", "wheels-19"], price=awd_price, conf="verified" if awd_price else conf, sources=src))
    return ps

years.append({
    "year": 2021,
    "notes": "Carry-over year. Package line-up assumed unchanged from 2020; prices not verified. Based on Cars.com, the SXT was about $31,045 and the GT $34,045 including destination.",
    "sources": [S["cars2022"], S["memory"]],
    "trims": [sxt(2021, conf="likely", extra=["uconnect-7", "carplay-android"]), gt(GT_2019, conf="likely")],
    "packages": late_packages("likely", [S["memory"]]),
})
years.append({
    "year": 2022,
    "notes": "Carry-over year with an upgraded alarm. V6 rated 303 hp. Base prices are derived from Cars.com prices that include the $1,595 destination charge. Safety tech like blind-spot monitoring and adaptive cruise is still optional, and there is no automatic emergency braking.",
    "sources": [S["cars2022"]],
    "trims": [
        sxt(2022, msrp=29680, conf="likely", extra=["uconnect-7", "carplay-android"], notes="$31,275 including destination per Cars.com."),
        gt(GT_2019, msrp=32955, conf="likely", notes="$34,550 including destination per Cars.com."),
    ],
    "packages": late_packages("likely", [S["cars2022"]], awd_price={"sxt": 2605, "gt": 3000}),
})
p2023 = late_packages("likely", [S["at2023"], S["bpo2023"]])
for p in p2023:
    if p["id"] == "plus":
        p["features"] = p["features"] + ["seat-memory"]
        p["notes"] = "SXT: Nappa sport seats, heated seats and wheel, seat memory, Uconnect 4C with 8.4-inch screen and SiriusXM, premium audio, 20-inch wheels, rear park sensors, performance brakes."
p2023.append(pkg("gt-plus-group", "GT Plus Group", ["gt"], ["ventilated-seats", "nappa-alcantara"], conf="likely", sources=[S["at2023"]]))
p2023.append(pkg("ambient-lighting", "Ambient interior lighting", ["gt"], ["ambient-lighting"], conf="likely", sources=[S["at2023"]]))
years.append({
    "year": 2023,
    "notes": "Final model year (Last Call). Both SXT and GT offered in RWD or AWD. Sources disagree on base prices by $1,420: Autotrader says SXT $30,545 and GT $33,845, BuildPriceOption says $31,965 and $35,265 (Dodge raised prices during the year, which may explain it). Lower figures used here.",
    "sources": [S["at2023"], S["bpo2023"]],
    "trims": [
        sxt(2023, msrp=30545, conf="likely", extra=["uconnect-7", "carplay-android", "alpine-6"], notes="AWD adds 19-inch wheels and a 3.07 axle (+$3,000)."),
        gt(GT_2019, msrp=33845, conf="likely", notes="GT AWD +$3,000; it lacks the RWD car's performance suspension and steering."),
    ],
    "packages": p2023,
})

# drop None notes
for y in years:
    for p in y["packages"]:
        if p.get("notes") is None:
            p.pop("notes", None)

# validate refs
for y in years:
    for t in y["trims"]:
        for f in t["standardFeatures"]:
            assert f in F, (y["year"], f)
    for p in y["packages"]:
        for f in p["features"]:
            assert f in F, (y["year"], p["id"], f)

data = {
    "schemaVersion": 1,
    "model": {
        "make": "Dodge",
        "name": "Challenger",
        "engine": "3.6L Pentastar V6",
        "notes": "Covers the V6 trims (SXT and GT) for model years 2015-2023. Prices are US MSRP in USD excluding destination unless noted. Each trim and package carries a confidence flag: verified (from an option list or press release), likely (secondary source or carry-over), uncertain (general knowledge, needs checking).",
    },
    "features": F,
    "years": years,
}
json.dump(data, open(sys.argv[1], "w"), indent=2, ensure_ascii=False)
print("ok", len(F), "features", len(years), "years")
