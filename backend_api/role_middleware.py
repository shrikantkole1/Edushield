from fastapi import HTTPException, status, Depends
from auth import get_current_user

def require_role(required_role: str):
    """
    Dependency generator that checks if the current user has the required role.
    E.g. Depends(require_role('admin'))
    """
    def role_dependency(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires {required_role} role.",
            )
        return current_user
    return role_dependency
