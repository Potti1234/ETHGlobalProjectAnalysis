import pandas as pd

def remove_duplicates():
    data = pd.read_csv('data/data/ethglobal_projects.csv')
    data = data.drop_duplicates(subset=['link'])
    data.to_csv('data/data/ethglobal_projects_unique.csv', index=False)

def main():
    remove_duplicates()

if __name__ == "__main__":
    main()
