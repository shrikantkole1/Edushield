import pandas as pd
import numpy as np

class DataPreprocessor:
    """
    Handles preprocessing pipeline for local client data.
    Runs entirely on the Edge/Client device.
    """
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.academic_features = ['cgpa', 'attendance_percentage', 'study_hours']
        self.placement_features = ['coding_score', 'aptitude_score', 'communication_score']
        
    def normalize_features(self) -> pd.DataFrame:
        """Min-Max normalization to prevent large gradients."""
        df_norm = self.df.copy()
        
        constraints = {
            'cgpa': 10.0,
            'attendance_percentage': 100.0,
            'study_hours': 40.0,
            'coding_score': 100.0,
            'aptitude_score': 100.0,
            'communication_score': 100.0
        }
        
        for feature, max_val in constraints.items():
            if feature in df_norm.columns:
                df_norm[feature] = df_norm[feature] / max_val
                
        return df_norm

    def build_academic_dataset(self) -> tuple:
        """
        Builds inputs/targets for the Academic Predictor (Regression/Classification)
        Predicts Risk Category (0=Low, 1=Medium, 2=High)
        """
        df_norm = self.normalize_features()
        X = df_norm[self.academic_features].values
        
        risk = []
        for _, row in df_norm.iterrows():
            score = row['cgpa'] * 0.5 + row['attendance_percentage'] * 0.3 + (row['study_hours']/40)*0.2
            risk.append(2 if score < 0.4 else (1 if score < 0.7 else 0))
                
        return X, np.array(risk)

    def build_placement_dataset(self) -> tuple:
        """
        Builds inputs/targets for the Placement Readiness Predictor (Binary Classification)
        Predicts Placement Readiness % -> classification
        """
        df_norm = self.normalize_features()
        X = df_norm[self.placement_features + ['cgpa']].values
        
        ready = []
        for _, row in df_norm.iterrows():
            readiness_score = (row['coding_score'] * 0.4 + 
                             row['aptitude_score'] * 0.3 + 
                             row['communication_score'] * 0.2 + 
                             row['cgpa'] * 0.1)
            ready.append(1 if readiness_score > 0.65 else 0)
            
        return X, np.array(ready)
