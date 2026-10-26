"""Compatibility entry point for the shared skill-based voice generator."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("generate_demo_voice.py")), run_name="__main__")
