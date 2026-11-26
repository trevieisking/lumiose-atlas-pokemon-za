import numpy as np
from scipy.optimize import least_squares
R=[(135,45),(221,45),(252,82),(619,82),(651,45),(736,45),(767,76),(767,160),(730,191),(730,561),(767,592),(767,675),(737,707),(651,707),(620,669),(252,669),(221,707),(135,707),(105,675),(105,592),(141,561),(141,191),(105,160),(105,76)]
N=[(60,38),(138,38),(168,74),(506,76),(534,43),(610,44),(640,71),(638,150),(605,177),(603,514),(634,545),(634,625),(605,653),(530,651),(498,616),(161,612),(132,645),(57,644),(28,614),(28,538),(63,508),(65,173),(32,143),(32,65)]
S=[(57,42),(136,41),(169,76),(518,70),(548,31),(629,29),(657,59),(659,143),(626,176),(628,528),(661,558),(661,642),(633,670),(551,670),None,None,(144,671),(65,672),(39,644),(39,556),(72,536),(65,183),(31,152),(29,69)]
crosses=[[(101,106),(543,111),(98,546),(538,550)],[(101,114),(558,108),(106,575),(562,569)]]
hold=[1,4,8,12,16,19,22]
Y=(np.array(R)/2+np.array([1830,1860])-2000)/100
def project(xy,m):
 xy=np.c_[xy,np.ones(len(xy))]@np.r_[m,1].reshape((3,3)).T
 return xy[:,:2]/xy[:,2:]
output=[]
for pts,marks in zip([N,S],crosses):
 good=[i for i,p in enumerate(pts) if p is not None]
 fit=[i for i in good if i not in hold];ho=[i for i in hold if i in good]
 X=(np.array([p if p else (0,0) for p in pts])-350)/350
 m=least_squares(lambda m:(project(X[fit],m)-Y[fit]).ravel(), [3,0,0,0,3,0,0,0]).x
 tar=project((np.array(marks)-350)/350,m)*100+2000
 print('fit, max_holdout',len(fit),max(np.linalg.norm(project(X[ho],m)-Y[ho],axis=1))*100)
 print('crosses:',tar.round(2).tolist())
 print('intervals:',[round(np.linalg.norm(tar[i]-tar[j]),2) for i,j in [(0,1),(0,2),(1,3),(2,3)]])
 output.append(tar)
print('between-photo differences:',np.linalg.norm(output[0]-output[1],axis=1).round(2).tolist())
