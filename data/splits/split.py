"""
What the script does:
- Reads data/processed/clean_annotated_4k.csv (3,947 rows)
- Splits data with fixed random seed (42) for reproducibility
- Creates 70/15/15 train/val/test splits
- Uses stratified splitting for single-label tasks to maintain class distribution
- Generates 4 task-specific datasets with 6 files each (24 total files)

Results:
- Train: 2,762 rows (70.0%)
- Validation: 592 rows (15.0%)
- Test: 593 rows (15.0%)

Tasks created:
- sentiment/ - Sentiment classification (SEN: 0/1/2)
- hate_offense/ - Hate/offense detection (HAO: binary)
- political/ - Political content detection (POL: binary)
- multi_topics/ - Multi-label classification (9 topic columns)

Notes:
- All splits maintain row alignment (X and y correspond to the same samples)
- The same train/val/test split is used across all 4 tasks for consistency
"""





import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Configuration
INPUT_CSV = '../processed/clean_annotated_4k.csv'
RANDOM_SEED = 42
TRAIN_SIZE = 0.70
VAL_SIZE = 0.15
TEST_SIZE = 0.15

# Verify splits sum to 1.0
assert TRAIN_SIZE + VAL_SIZE + TEST_SIZE == 1.0, "Split ratios must sum to 1.0"

def create_directory(path):
    """Create directory if it doesn't exist"""
    os.makedirs(path, exist_ok=True)

def save_split(X, y, X_path, y_path):
    """Save X and y data to CSV files"""
    X.to_csv(X_path, index=False)
    y.to_csv(y_path, index=False)
    print(f"  Saved {X_path} ({len(X)} rows)")
    print(f"  Saved {y_path} ({len(y)} rows)")

def split_and_save_task(df, task_name, X_col, y_cols):
    """
    Split data for a specific task and save to CSV files

    Args:
        df: Full dataset
        task_name: Name of the task (used for folder naming)
        X_col: Column name(s) for features
        y_cols: Column name(s) for labels
    """
    print(f"\n{'='*60}")
    print(f"Processing: {task_name}")
    print(f"{'='*60}")

    # Create task directory
    task_dir = f"./{task_name}/"
    create_directory(task_dir)

    # Extract X and y
    X = df[[X_col]] if isinstance(X_col, str) else df[X_col]
    y = df[[y_cols]] if isinstance(y_cols, str) else df[y_cols]

    print(f"Total samples: {len(df)}")
    print(f"Features: {X_col}")
    print(f"Labels: {y_cols}")

    # First split: train vs (val + test)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y,
        test_size=(VAL_SIZE + TEST_SIZE),
        random_state=RANDOM_SEED,
        stratify=y if isinstance(y_cols, str) else None  # Stratify only for single-label tasks
    )

    # Second split: val vs test (split the temp set in half)
    val_ratio = VAL_SIZE / (VAL_SIZE + TEST_SIZE)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp,
        test_size=(1 - val_ratio),
        random_state=RANDOM_SEED,
        stratify=y_temp if isinstance(y_cols, str) else None
    )

    print(f"\nSplit sizes:")
    print(f"  Train: {len(X_train)} ({len(X_train)/len(df)*100:.1f}%)")
    print(f"  Val:   {len(X_val)} ({len(X_val)/len(df)*100:.1f}%)")
    print(f"  Test:  {len(X_test)} ({len(X_test)/len(df)*100:.1f}%)")

    # Save all splits
    print(f"\nSaving files:")
    save_split(X_train, y_train, f"{task_dir}X_train_{task_name}.csv", f"{task_dir}y_train_{task_name}.csv")
    save_split(X_val, y_val, f"{task_dir}X_val_{task_name}.csv", f"{task_dir}y_val_{task_name}.csv")
    save_split(X_test, y_test, f"{task_dir}X_test_{task_name}.csv", f"{task_dir}y_test_{task_name}.csv")

def main():
    print("="*60)
    print("Dataset Splitting Script")
    print("="*60)

    # Load the dataset
    print(f"\nLoading dataset from: {INPUT_CSV}")
    df = pd.read_csv(INPUT_CSV)
    print(f"Loaded {len(df)} rows and {len(df.columns)} columns")
    print(f"Columns: {', '.join(df.columns.tolist())}")

    # Task 1: Sentiment Analysis
    split_and_save_task(
        df=df,
        task_name='sentiment',
        X_col='Text',
        y_cols='SEN'
    )

    # Task 2: Hate and Offense Detection
    split_and_save_task(
        df=df,
        task_name='hate_offense',
        X_col='Text',
        y_cols='HAO'
    )

    # Task 3: Political Content Detection
    split_and_save_task(
        df=df,
        task_name='political',
        X_col='Text',
        y_cols='POL'
    )

    # Task 4: Multi-label Topic Classification
    topic_columns = ['PGS', 'FT', 'EYE', 'HBF', 'FR', 'EMP', 'BF', 'SW', 'DO']
    split_and_save_task(
        df=df,
        task_name='multi_topics',
        X_col='Text',
        y_cols=topic_columns
    )

    print("\n" + "="*60)
    print("✓ All splits created successfully!")
    print("="*60)

if __name__ == "__main__":
    main()
