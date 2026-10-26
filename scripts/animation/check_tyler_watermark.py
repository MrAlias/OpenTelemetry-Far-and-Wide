"""Compatibility entry point: verify both speakers with the shared checker."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('check_demo_watermarks.py')),run_name='__main__')
