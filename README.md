# TikNep: Nepali TikTok Comment Analysis

A comprehensive machine learning project for multi-task text classification of Nepali TikTok comments. This project implements and compares multiple ML architectures (traditional ML, deep learning, and transformers) across four distinct NLP tasks.

## Project Overview

TikNep performs multi-task classification on 3,947 manually annotated Nepali TikTok comments:

1. **Sentiment Analysis** (3-class): Neutral, Negative, Positive
2. **Hate & Offense Detection** (binary): Not Offensive, Offensive
3. **Political Content Detection** (binary): Non-Political, Political
4. **Multi-label Topic Classification** (9 topics): PGS, FT, EYE, HBF, FR, EMP, BF, SW, DO

### Models Implemented

Each task is evaluated using **6 different model architectures**:

- **Traditional ML**: SVM, Multinomial Naive Bayes, Random Forest (with TF-IDF features)
- **Deep Learning**: Bidirectional LSTM, Bidirectional GRU (with word embeddings)
- **Transformers**: BERT (multilingual-base-cased)

## Project Structure

```text
TikNep/
├── data/
│   ├── processed/
│   │   └── clean_annotated_4k.csv          # Main annotated dataset
│   └── splits/                              # Train/val/test splits (70/15/15)
│       ├── sentiment/                       # Sentiment analysis splits
│       ├── hate_offense/                    # Hate/offense detection splits
│       ├── political/                       # Political content splits
│       └── multi_topics/                    # Multi-label topic splits
│
├── notebooks/
│   ├── 01_EDA.ipynb                         # Exploratory data analysis
│   ├── 02_sentiment_analysis_models.ipynb   # Sentiment models & evaluation
│   ├── 03_hate_offense_models.ipynb         # Hate/offense models & evaluation
│   ├── 04_political_stance_models.ipynb     # Political models & evaluation
│   └── 05_multi_label_topic.ipynb           # Multi-label models & evaluation
│
├── models/                                   # Saved trained models
│   ├── sentiment/
│   ├── hate_offense/
│   ├── political/
│   └── multi_topics/
│
├── scraper/                                  # Data collection tools
│   ├── tiktok_comment_scraper.js            # Browser console scraper
│   ├── copy_scraper_js.py                   # Copy JS to clipboard
│   ├── tiktok_comments_to_json.py           # Save scraped data
│   └── raw_data/                            # Raw scraped JSON files
│
├── verify_cleaning.py                        # Dataset verification script
├── requirements.txt                          # Python dependencies
├── setup.py                                  # Package configuration
└── README.md                                 # This file
```

##  Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) GPU with CUDA support for faster training

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd TikNep
```

2.**Create and activate virtual environment**

```bash
# Create virtual environment
python3 -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

3.**Install dependencies**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Verify Installation

```bash
# Check installed packages
pip list

# Verify dataset
python verify_cleaning.py
```

##  Usage

### 1. Exploratory Data Analysis

```bash
# Launch Jupyter Notebook
jupyter notebook

# Open notebooks/01_EDA.ipynb
```

This notebook provides:

- Dataset statistics and distributions
- Class balance analysis
- Text length analysis
- Multi-label co-occurrence patterns
- Visualizations

### 2. Train Models

Each task has a dedicated notebook with all 6 models:

```bash
# Sentiment Analysis (3-class)
# Open notebooks/02_sentiment_analysis_models.ipynb

# Hate & Offense Detection (binary)
# Open notebooks/03_hate_offense_models.ipynb

# Political Content Detection (binary)
# Open notebooks/04_political_stance_models.ipynb

# Multi-label Topic Classification
# Open notebooks/05_multi_label_topic.ipynb
```

Each notebook includes:

- Data loading and preprocessing
- Model training with hyperparameter tuning
- Comprehensive evaluation (accuracy, precision, recall, F1)
- Confusion matrices and training curves
- Model comparison and analysis
- Model saving for deployment

### 3. Data Splitting

To regenerate train/val/test splits (70/15/15):

```bash
cd data/splits
python split.py
```

This creates stratified splits for all four tasks with fixed random seed (42) for reproducibility.

### 4. Data Collection (Optional)

To scrape new TikTok comments:

```bash
cd scraper

# Step 1: Copy JavaScript scraper to clipboard
python copy_scraper_js.py

# Step 2: Paste into browser console on TikTok video page

# Step 3: Copy the JSON output and save it
python tiktok_comments_to_json.py
```

## 🔧 Configuration

### Model Hyperparameters

All models use consistent hyperparameters for fair comparison:

**Traditional ML:**

- TF-IDF: max_features=50000, ngram_range=(1,2)
- SVM: LinearSVC with class_weight='balanced'
- Random Forest: n_estimators=300, with TruncatedSVD(n_components=300)

**Deep Learning:**

- Vocabulary size: 50,000
- Sequence length: 128
- Embedding dimension: 300
- LSTM/GRU units: 128
- Batch size: 32
- Max epochs: 50 (with early stopping)
- Callbacks: EarlyStopping, ReduceLROnPlateau

**BERT:**

- Model: bert-base-multilingual-cased
- Max length: 128
- Batch size: 16
- Learning rate: 2e-5
- Epochs: 3

### Data Split Configuration

Edit `data/splits/split.py` to modify:

```python
TRAIN_SIZE = 0.70  # 70% for training
VAL_SIZE = 0.15    # 15% for validation
TEST_SIZE = 0.15   # 15% for testing
RANDOM_SEED = 42   # For reproducibility
```

##  Results

Model performance is evaluated on held-out test sets using:

- **Accuracy**: Overall classification accuracy
- **Precision/Recall/F1**: Per-class and macro-averaged metrics
- **Confusion Matrix**: Visual analysis of misclassifications
- **Classification Report**: Detailed per-class metrics

For multi-label task:

- **Hamming Loss**: Fraction of incorrectly predicted labels
- **Exact Match Accuracy**: Percentage of perfectly predicted label sets
- **Per-label Metrics**: Precision/recall/F1 for each of 9 topics

Results are saved to:

- CSV format: `results/<task>_model_comparison.csv`
- Text format: `results/<task>_detailed_report.txt`

##  Development

### Code Style

This project follows Python best practices:

- **PEP 8** style guide
- **Type hints** for function signatures
- **Docstrings** for all functions and classes
- **Modular design** with reusable functions
- **Consistent naming** conventions

### Formatting Tools

```bash
# Auto-format code
black .

# Check style compliance
flake8 .

# Sort imports
isort .
```

##  Dependencies

Main dependencies (see `requirements.txt` for full list):

- **Data Science**: numpy, pandas, scipy
- **Machine Learning**: scikit-learn
- **Deep Learning**: tensorflow, transformers
- **Visualization**: matplotlib, seaborn
- **NLP**: langdetect, tokenizers
- **Jupyter**: jupyter, notebook, ipykernel
- **Utilities**: tqdm, pyperclip

##  Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Authors

- TikNep Development Team

##  Acknowledgments

- Pre-trained models: Hugging Face Transformers
- Nepali NLP resources: NepBERTa team
- TikTok data: Manual annotation team

##  Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This project is for research and educational purposes. Ensure compliance with TikTok's Terms of Service when collecting data.
