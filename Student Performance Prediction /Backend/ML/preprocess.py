{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "5a414b7e",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "import os\n",
    "\n",
    "print(\"Current Directory:\", os.getcwd())\n",
    "\n",
    "df = pd.read_csv(\"../data/raw/student-por.csv\", sep=\";\")\n",
    "\n",
    "print(df.shape)\n",
    "print(df.isnull().sum())\n",
    "print(df.duplicated().sum())\n",
    "\n",
    "df = df.drop_duplicates()\n",
    "\n",
    "df.to_csv(\"../data/processed/cleaned_student_data.csv\", index=False)\n",
    "\n",
    "print(\"Dataset cleaned successfully!\")"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "SQL",
   "language": "sql",
   "name": "sql-notebook"
  },
  "language_info": {
   "name": "sql"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
