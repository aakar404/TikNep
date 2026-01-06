#!/usr/bin/env python3
"""
Data verification script for TikNep dataset.

Displays summary statistics and sample data from the cleaned and annotated
Nepali TikTok comments dataset.
"""

import pandas as pd


def verify_data():
    """Display dataset statistics and sample data."""
    # Read cleaned annotated data
    df = pd.read_csv('data/processed/clean_annotated_4k.csv')

    print("=" * 80)
    print("TIKNEP DATASET VERIFICATION")
    print("=" * 80)

    print(f"\nDataset Information:")
    print(f"  Total samples: {len(df)}")
    print(f"  Total columns: {len(df.columns)}")
    print(f"  Columns: {', '.join(df.columns.tolist())}")

    print("\n" + "=" * 80)
    print("CLASS DISTRIBUTION")
    print("=" * 80)

    # Sentiment distribution
    print("\nSentiment (SEN):")
    sentiment_counts = df['SEN'].value_counts().sort_index()
    sentiment_map = {0: 'Neutral', 1: 'Negative', 2: 'Positive'}
    for label, count in sentiment_counts.items():
        print(f"  {sentiment_map[label]} ({label}): {count} ({count/len(df)*100:.1f}%)")

    # Hate/Offense distribution
    print("\nHate & Offense (HAO):")
    hao_counts = df['HAO'].value_counts().sort_index()
    hao_map = {0: 'Not Offensive', 1: 'Offensive'}
    for label, count in hao_counts.items():
        print(f"  {hao_map[label]} ({label}): {count} ({count/len(df)*100:.1f}%)")

    # Political distribution
    print("\nPolitical (POL):")
    pol_counts = df['POL'].value_counts().sort_index()
    pol_map = {0: 'Non-Political', 1: 'Political'}
    for label, count in pol_counts.items():
        print(f"  {pol_map[label]} ({label}): {count} ({count/len(df)*100:.1f}%)")

    # Topic distribution
    print("\nMulti-label Topics:")
    topic_columns = ['PGS', 'FT', 'EYE', 'HBF', 'FR', 'EMP', 'BF', 'SW', 'DO']
    for topic in topic_columns:
        count = df[topic].sum()
        print(f"  {topic}: {count} ({count/len(df)*100:.1f}%)")

    print("\n" + "=" * 80)
    print("TEXT STATISTICS")
    print("=" * 80)

    # Calculate text statistics
    text_lengths = df['Text'].str.len()

    print(f"\nText lengths (characters):")
    print(f"  Min: {text_lengths.min()}")
    print(f"  Max: {text_lengths.max()}")
    print(f"  Mean: {text_lengths.mean():.2f}")
    print(f"  Median: {text_lengths.median():.0f}")

    print("\n" + "=" * 80)
    print("SAMPLE DATA (First 5 records)")
    print("=" * 80)

    # Display sample records
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        print(f"\n[{row['SN']}] Text ID: {row['Text ID']}")
        print(f"  Text: {row['Text']}")
        print(f"  SEN={row['SEN']}, HAO={row['HAO']}, POL={row['POL']}")
        topics = [col for col in topic_columns if row[col] == 1]
        print(f"  Topics: {', '.join(topics) if topics else 'None'}")

    print("\n" + "=" * 80)
    print("VERIFICATION COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    verify_data()
