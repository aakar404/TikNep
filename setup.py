"""Setup configuration for TikNep project."""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8")

setup(
    name="tiknep",
    version="1.0.0",
    author="TikNep Development Team",
    description="Multi-task text classification for Nepali TikTok comments",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Text Processing :: Linguistic",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "numpy>=1.24.0,<2.0.0",
        "pandas>=2.0.0,<3.0.0",
        "scipy>=1.10.0,<2.0.0",
        "scikit-learn>=1.3.0,<2.0.0",
        "tensorflow>=2.13.0,<3.0.0",
        "transformers>=4.30.0,<5.0.0",
        "tokenizers>=0.13.0,<1.0.0",
        "langdetect>=1.0.9,<2.0.0",
        "matplotlib>=3.7.0,<4.0.0",
        "seaborn>=0.12.0,<1.0.0",
        "tqdm>=4.65.0,<5.0.0",
        "pyperclip>=1.8.2,<2.0.0",
    ],
    extras_require={
        "dev": [
            "black>=23.0.0,<24.0.0",
            "flake8>=6.0.0,<7.0.0",
            "isort>=5.12.0,<6.0.0",
            "jupyter>=1.0.0,<2.0.0",
            "notebook>=7.0.0,<8.0.0",
            "ipykernel>=6.25.0,<7.0.0",
        ],
    },
    include_package_data=True,
    keywords=[
        "nepali",
        "nlp",
        "text-classification",
        "sentiment-analysis",
        "hate-speech-detection",
        "multi-label-classification",
        "deep-learning",
        "transformers",
        "bert",
    ],
)
