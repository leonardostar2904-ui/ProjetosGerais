import sys, glob, os
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
for src in sorted(glob.glob('fonts/*.woff2')):
    f = TTFont(src)
    glyf = f['glyf']; gs = f.getGlyphSet()
    n = 0
    for name in f.getGlyphOrder():
        if glyf[name].isComposite():
            rp = DecomposingRecordingPen(gs)
            gs[name].draw(rp)
            tp = TTGlyphPen(None)
            rp.replay(tp)
            glyf[name] = tp.glyph()
            n += 1
    f.flavor = None
    dst = os.path.join('fonts-flat', os.path.basename(src).replace('.woff2', '.ttf'))
    f.save(dst)
    print(os.path.basename(dst), 'compostos achatados:', n)
