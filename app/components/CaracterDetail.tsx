


const DetailRow = ({ label, children }:{ label:any, children:any }) => (
  <div className="grid grid-cols-3 gap-4 border-t border-gray-700 py-3">
    <dt className="col-span-1 text-sm font-medium text-gray-400">{label}</dt>
    <dd className="col-span-2 text-sm text-gray-200">{children}</dd>
  </div>
);

export const CharacterDetails = ({ character }:{ character:any }) => {
    if (!character) {
        return null;
    }
  const renderLink = (item:any) => {
    if (item && item.url) {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors duration-200"
        >
          {item.name}
        </a>
      );
    }
    return <span>{item ? item.name : 'Unknown'}</span>;
  };
  
  const statusIndicator = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-500',
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden my-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:flex-shrink-0">
          <img
            className="h-64 w-full object-cover md:h-full md:w-64"
            src={character.image}
            alt={`Image of ${character.name}`}
          />
        </div>

        <div className="p-6 md:p-8 flex-grow">
          <h1 className="text-3xl font-bold text-white mb-2">{character.name}</h1>
          
                  <div className="flex items-center mb-4 text-lg">
                      {/*@ts-ignore*/}
            <span className={`w-3 h-3 rounded-full mr-2 ${statusIndicator[character.status] || 'bg-gray-500'}`}></span>
            {character.status} - {character.species}
          </div>
          <dl>
            <DetailRow label="Gender">{character.gender}</DetailRow>
            
            <DetailRow label="Type">{character.type || 'N/A'}</DetailRow>

            <DetailRow label="Origin">
              {renderLink(character.origin)}
            </DetailRow>

            <DetailRow label="Last Known Location">
              {renderLink(character.location)}
            </DetailRow>

            <DetailRow label="API Link">
              <a 
                href={character.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors duration-200 break-all"
              >
                View original data
              </a>
            </DetailRow>
            
            <DetailRow label="Created">
              {new Date(character.created).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </DetailRow>
          </dl>
        </div>
      </div>
    </div>
  );
};