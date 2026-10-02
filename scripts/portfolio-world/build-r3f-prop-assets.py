#!/usr/bin/env python3
"""Lossless, transparent runtime prop assembly for R3F (no collision data)."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "portfolio-world-v2" / "public" / "assets" / "world" / "props" / "r3f"
S = 3
def canvas(w,h): return Image.new("RGBA", (w*S,h*S), (0,0,0,0))
def draw(im): return ImageDraw.Draw(im)
def rect(d, box, fill, outline=None, width=1):
    box=tuple(v*S for v in box); d.rounded_rectangle(box, radius=2*S, fill=fill, outline=outline, width=width*S)
def line(d, points, fill, width=1): d.line([(x*S,y*S) for x,y in points], fill=fill, width=width*S, joint="curve")
def ell(d, box, fill, outline=None, width=1): d.ellipse(tuple(v*S for v in box), fill=fill, outline=outline, width=width*S)
def poly(d, pts, fill, outline=None): d.polygon([(x*S,y*S) for x,y in pts], fill=fill); outline and d.line([(x*S,y*S) for x,y in pts+[pts[0]]], fill=outline, width=S, joint="curve")
def save(im,name): im.resize((im.width//S,im.height//S), Image.Resampling.LANCZOS).save(OUT/name, "PNG", optimize=True)

def bollards():
    im=canvas(120,35); d=draw(im)
    for x in (18,88):
        ell(d,(x-12,26,x+15,33),(48,55,58,230)); rect(d,(x-4,9,x+7,29),(54,66,70,255),(27,38,42,255)); ell(d,(x-5,5,x+8,14),(130,114,77,255),(35,45,45,255)); ell(d,(x-1,8,x+4,12),(217,184,99,255))
    line(d,[(25,21),(43,15),(61,21),(84,17)],(164,119,66,240),2); ell(d,(45,17,62,30),(0,0,0,0),(190,143,79,220),2); line(d,[(47,22),(60,25),(52,29),(45,22)],(190,143,79,220),1)
    save(im,"bollard-set.png")
def bench():
    im=canvas(140,35); d=draw(im); ell(d,(12,26,130,34),(49,46,39,110));
    for x in (30,104): rect(d,(x,21,x+7,32),(58,61,56,255),(34,38,35,255)); rect(d,(x+2,16,x+5,30),(154,126,78,255))
    for y in (12,18): rect(d,(18,y,121,y+5),(121,77,42,255),(72,45,30,255)); line(d,[(24,y+1),(113,y+1)],(213,162,91,190),1)
    ell(d,(2,19,19,35),(165,97,52,255),(95,54,32,255)); ell(d,(5,13,17,27),(59,106,60,255)); ell(d,(0,16,13,30),(74,130,69,255)); save(im,"plaza-bench-set.png")
def lamp():
    im=canvas(40,115); d=draw(im); ell(d,(10,104,31,113),(45,49,48,200)); rect(d,(17,35,23,106),(41,57,65,255),(22,35,40,255)); rect(d,(15,101,26,108),(139,113,62,255),(44,47,42,255));
    line(d,[(20,37),(20,24),(31,24),(34,31)],(35,51,58,255),3); poly(d,[(28,31),(37,31),(34,45),(30,45)],(247,194,92,255),(54,54,49,255)); ell(d,(30,34,35,42),(255,231,156,240)); ell(d,(15,15,25,27),(146,114,59,255),(33,46,48,255)); line(d,[(18,16),(22,10),(26,16)],(36,52,58,255),2); save(im,"lamp-set.png")
def planters():
    im=canvas(65,45); d=draw(im)
    for x in (7,38):
        ell(d,(x,30,x+20,43),(50,46,39,130)); poly(d,[(x+2,24),(x+18,24),(x+15,39),(x+5,39)],(172,101,49,255),(107,56,31,255)); line(d,[(x+5,28),(x+15,28)],(232,150,79,230),1)
        ell(d,(x-1,13,x+11,28),(65,122,65,255)); ell(d,(x+8,8,x+22,28),(56,111,62,255)); ell(d,(x+4,4,x+17,23),(85,142,66,255));
    save(im,"planter-pair.png")
def crates():
    im=canvas(135,65); d=draw(im); ell(d,(2,52,132,64),(51,45,35,110));
    for x,y,w,h in ((10,23,37,31),(43,11,40,43),(82,28,32,26)):
        rect(d,(x,y,x+w,y+h),(145,91,44,255),(80,49,29,255)); line(d,[(x+3,y+3),(x+w-3,y+h-3)],(207,148,74,220),2); line(d,[(x+w-3,y+3),(x+3,y+h-3)],(100,58,32,220),1)
    ell(d,(111,21,132,55),(126,78,41,255),(69,43,30,255)); ell(d,(111,19,132,28),(185,125,63,255),(78,45,28,255));
    for r in (10,15,20): ell(d,(92-r/2,45-r/2,92+r/2,45+r/2),(0,0,0,0),(194,143,75,230),1)
    save(im,"quay-crate-barrel-set.png")
def banners():
    im=canvas(350,95); d=draw(im)
    for x in (28,282):
        rect(d,(x,12,x+8,85),(135,110,65,255),(73,56,39,255)); ell(d,(x-3,7,x+11,18),(202,165,81,255),(77,58,39,255)); poly(d,[(x+8,19),(x+58,25),(x+54,75),(x+8,67)],(26,58,94,255),(158,124,58,255)); line(d,[(x+15,31),(x+48,35)],(209,176,82,255),2); poly(d,[(x+30,39),(x+38,49),(x+30,59),(x+22,49)],(218,181,82,255))
    line(d,[(38,20),(180,11),(292,20)],(150,113,61,255),3); save(im,"hall-banner-set.png")
def stairrail():
    im=canvas(284,185); d=draw(im)
    for side in (10,260):
        line(d,[(side,12),(side,175)],(35,51,55,240),3); line(d,[(side+8 if side==10 else side-8,15),(side+8 if side==10 else side-8,174)],(176,139,70,200),1)
        for y in range(28,174,28): line(d,[(side,y),(side+18 if side==10 else side-18,y+9)],(40,57,61,220),2)
    line(d,[(10,12),(54,5),(100,15),(150,7),(205,15),(260,8)],(42,58,63,255),3); save(im,"stair-railing-overlay.png")
def quayrail():
    im=canvas(890,60); d=draw(im); line(d,[(0,18),(890,18)],(37,57,62,255),3); line(d,[(0,25),(890,25)],(173,138,70,210),1)
    for x in range(10,890,62):
        line(d,[(x,15),(x,55)],(36,54,60,255),3); ell(d,(x-4,10,x+4,18),(198,161,80,255),(43,53,55,255)); line(d,[(x,39),(x+25,18)],(47,65,69,220),1); line(d,[(x+25,18),(x+49,39)],(47,65,69,220),1)
    save(im,"quay-railing-overlay.png")
def vegetation():
    im=canvas(85,85); d=draw(im); rect(d,(0,55,84,82),(160,136,90,255),(95,76,49,255)); line(d,[(4,63),(80,63)],(213,184,117,170),1)
    for x,y,r,c in ((7,45,16,(71,123,67,255)),(22,33,18,(55,109,64,255)),(41,40,21,(78,134,70,255)),(59,28,19,(48,103,61,255)),(70,46,15,(88,143,72,255))): ell(d,(x-r/2,y-r/2,x+r/2,y+r/2),c)
    for x in range(8,80,14): line(d,[(x,56),(x+5,38)],(48,87,51,255),1)
    save(im,"low-wall-vegetation.png")
OUT.mkdir(parents=True, exist_ok=True)
bollards(); bench(); lamp(); planters(); crates(); banners(); stairrail(); quayrail(); vegetation()
